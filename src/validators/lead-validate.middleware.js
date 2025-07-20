import Joi from 'joi'
import commonValidate from './common-validate.middleware.js'
import {
    Customer,
    LEAD_SOURCE_ENUM,
    LEAD_STATUS_ENUM,
} from '../../models/index.js'

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
        next(error)
    }
}

const leadSource = async (req, res, next) => {
    req.leadSource = LEAD_SOURCE_ENUM.ORGANIZATION
    next()
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
}
