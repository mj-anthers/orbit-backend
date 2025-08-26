import Joi from 'joi'
import commonValidate from './common-validate.middleware.js'
import {
    Customer,
    LEAD_SOURCE_ENUM,
    LEAD_STATUS_ENUM,
    LeadProvider,
    LeadProviderProgram,
    User,
} from '../../models/index.js'
import httpStatus from 'http-status'
import { AppError, consoleLog } from '../utils/index.js'

const customerBaseSchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required().messages({
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name cannot exceed 50 characters',
    }),
    email: commonValidate.validateEmail,
    phoneNumber: commonValidate.validatePhoneNumber,
})

const leadBaseSchema = Joi.object({
    leadProvider: commonValidate.validateUUID,
    customer: customerBaseSchema,
    effectiveDate: Joi.date().required(),
    notes: Joi.string().allow(null),
    installStatus: Joi.bool().required(),
    installDate: Joi.date().allow(null),
    country: Joi.string().max(3).required(),
    platformPlanName: Joi.string().required().allow(null),
    platformPlanPrice: Joi.number().min(0).required(),
    appPlanName: Joi.string().required().allow(null),
    appPlanPrice: Joi.number().min(0).required(),
    source: Joi.string().valid(...Object.values(LEAD_SOURCE_ENUM)),
})

const leadCreateSchema = {
    body: leadBaseSchema,
}

const leadIdSchema = {
    params: Joi.object({
        id: commonValidate.validateUUID,
    }),
}

const leadUpdateSchema = {
    params: Joi.object({
        id: commonValidate.validateUUID,
    }),
    body: {
        customer: customerBaseSchema,
        effectiveDate: Joi.date().required(),
        status: Joi.string().allow(...Object.values(LEAD_STATUS_ENUM)),
        notes: Joi.string().allow(null),
        installStatus: Joi.bool().required(),
        installDate: Joi.date().allow(null),
        country: Joi.string().max(3).required(),
        platformPlanName: Joi.string().required().allow(null),
        platformPlanPrice: Joi.number().min(0).required(),
        appPlanName: Joi.string().required().allow(null),
        appPlanPrice: Joi.number().min(0).required(),
        commissionEvents: Joi.array()
            .items(commonValidate.commissionItem)
            .required(),
    },
}

const leadCustomerValidate = async (req, res, next) => {
    try {
        consoleLog({
            data: req.leadProvider.organization,
        })
        const [record] = await Customer.findOrCreate({
            where: {
                email: req.body.customer.email,
                organization: req.leadProvider.organization,
            },
            defaults: {
                name: req.body.customer.name,
                email: req.body.customer.email,
                phoneNumber: req.body.customer.phoneNumber,
                isActive: true,
            },
        })
        req.leadCustomer = record
        next()
    } catch (error) {
        consoleLog(error)
        next(error)
    }
}

const leadSource = async (req, res, next) => {
    try {
        const leadProvider = await LeadProvider.findOne({
            where: {
                id: req.body.leadProvider,
                isDeleted: false,
            },
            include: [
                {
                    model: User,
                    as: 'userLeadProviderDatum',
                    attributes: ['id', 'email'],
                },
            ],
        })

        if (!leadProvider) throw new AppError(httpStatus.NOT_FOUND, 'LEAD_E17')

        const leadProviderProgramDatum = await LeadProviderProgram.findOne({
            where: {
                id: leadProvider.leadProviderProgram,
            },
        })

        if (req.body.source === LEAD_SOURCE_ENUM.ORGANIZATION) {
            const leadProviderProgramBelongsToOrganization =
                req.user.organizationIds.includes(
                    leadProviderProgramDatum.organization
                )

            if (!leadProviderProgramBelongsToOrganization)
                throw new AppError(httpStatus.UNAUTHORIZED, 'LEAD_E15')

            req.leadSource = LEAD_SOURCE_ENUM.ORGANIZATION
        }

        if (req.body.source === LEAD_SOURCE_ENUM.LEAD_PROVIDER) {
            if (req.user.id !== leadProvider.user)
                throw new AppError(httpStatus.UNAUTHORIZED, 'LEAD_E16')

            req.leadSource = LEAD_SOURCE_ENUM.LEAD_PROVIDER
        }

        req.leadProvider = leadProvider

        next()
    } catch (error) {
        next(error)
    }
}

const leadListingSchema = {
    query: Joi.object({
        leadProviders: commonValidate.validateUUIDNonRequired,
    }),
}

const leadCreateValidate = commonValidate.validate(leadCreateSchema)
const leadIdValidate = commonValidate.validate(leadIdSchema)
const leadUpdateValidate = commonValidate.validate(leadUpdateSchema)
/**
 * Generic validation middleware factory
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */

export default {
    leadCreateValidate,
    leadIdValidate,
    leadUpdateValidate,
    leadCustomerValidate,
    leadSource,
    leadListingSchema,
}
