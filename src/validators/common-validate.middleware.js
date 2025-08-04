import Joi from 'joi'
import httpStatus from 'http-status'
import { AppError, asyncHandler, consoleLog } from '../utils/index.js'
import {
    LeadProvider,
    LeadProviderProgram,
    Organization,
    User,
    UserOrganization,
} from '../../models/index.js'
import { Op } from 'sequelize'
import { COMMISSION_CALCULATION_TYPES } from '../../models/enum.js'
import { throwSpecificError } from '../middlewares/index.js'

const pick = (object, keys) => {
    return keys.reduce((obj, key) => {
        if (object && Object.hasOwn(object, key)) {
            obj[key] = object[key]
        }
        return obj
    }, {})
}

const validate = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body'])
    const object = pick(req, Object.keys(validSchema))
    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' }, abortEarly: false })
        .validate(object)
    if (error) {
        const messages = error.details.map((datum) => {
            const message = datum.message.replace(/"/gi, '')
            return `Invalid ${datum.context.label}: ${message}`
        })
        const errorMessage = messages.join('. ')
        return next(
            new AppError(
                httpStatus.PRECONDITION_FAILED,
                'GLOBAL_E2',
                errorMessage
            )
        )
    }
    Object.assign(req, value)
    return next()
}

const validateUUID = Joi.string()
    .guid({ version: ['uuidv4'] })
    .required()
    .messages({
        'string.guid': 'The Id must be a valid UUID v4',
        'any.required': 'The Id field is required',
        'string.base': 'The Id must be a string',
    })

const validateEmail = Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
})

const validatePhoneNumber = Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
        'string.pattern.base': 'Please provide a valid phone number',
    })

const validateOrganization = asyncHandler(
    async ({ req, user, organization, next }) => {
        try {
            const organizationDatum = await Organization.findOne({
                where: {
                    id: organization,
                    user: user.id,
                    isActive: true,
                    isDeleted: false,
                },
            })

            if (!organizationDatum)
                throw new AppError(httpStatus.UNAUTHORIZED, 'GLOBAL_E14')

            req.organization = organizationDatum
            next()
        } catch (error) {
            next(error)
        }
    }
)

const validatePostOrganization = asyncHandler(async (req, res, next) => {
    try {
        const user = req.user

        await validateOrganization({
            req,
            user,
            organization: req.body.organization,
            next,
        })
    } catch (error) {
        next(error)
    }
})

const validateParamOrganization = asyncHandler(async (req, res, next) => {
    try {
        const user = req.user

        await validateOrganization({
            req,
            user,
            organization: req.params.id,
            next,
        })
    } catch (error) {
        next(error)
    }
})

const validateUserOrganization = asyncHandler(
    async ({ req, user, userOrganization, next }) => {
        try {
            const userOrganizationDatum = await UserOrganization.findOne({
                where: {
                    id: userOrganization,
                    user: user.id,
                    isActive: true,
                    isDeleted: false,
                },
                include: [
                    {
                        model: Organization,
                        as: 'organizationDatum',
                        attributes: ['id', 'name', 'isActive', 'isDeleted'],
                    },
                ],
            })

            consoleLog({ userOrganizationDatum, id: req.body.userOrganization })

            if (!userOrganizationDatum)
                throw new AppError(httpStatus.UNAUTHORIZED, 'GLOBAL_E15')

            const organizationDatum = userOrganizationDatum.organizationDatum

            if (!organizationDatum)
                throw new AppError(httpStatus.UNAUTHORIZED, 'GLOBAL_E16')

            if (!organizationDatum.isActive)
                throw new AppError(httpStatus.UNAUTHORIZED, 'GLOBAL_E17')

            if (organizationDatum.isDeleted)
                throw new AppError(httpStatus.UNAUTHORIZED, 'GLOBAL_E18')

            req.userOrganization = userOrganizationDatum

            next()
        } catch (error) {
            consoleLog({ error })
            next(error)
        }
    }
)

const validatePostUserOrganization = asyncHandler(async (req, res, next) => {
    try {
        const user = req.user

        await validateUserOrganization({
            req,
            user,
            userOrganization: req.body.userOrganization,
            next,
        })
    } catch (error) {
        next(error)
    }
})

const validateParamUserOrganization = asyncHandler(async (req, res, next) => {
    try {
        const user = req.user

        await validateUserOrganization({
            req,
            user,
            userOrganization: req.params.id,
            next,
        })
    } catch (error) {
        next(error)
    }
})

const validateLeadProviderProgram = asyncHandler(
    async ({ req, user, leadProviderProgram, next }) => {
        try {
            const leadProviderProgramDatum = await LeadProviderProgram.findOne({
                where: {
                    id: leadProviderProgram,
                    organization: {
                        [Op.in]: user.organizationIds,
                    },
                },
            })
            if (!leadProviderProgramDatum)
                throw new AppError(httpStatus.UNAUTHORIZED, 'GLOBAL_E19')
            req.leadProviderProgram = leadProviderProgramDatum
            next()
        } catch (error) {
            next(error)
        }
    }
)

const validatePostLeadProviderProgram = asyncHandler(async (req, res, next) => {
    try {
        const user = req.user

        await validateLeadProviderProgram({
            req,
            user,
            leadProviderProgram: req.body.leadProviderProgram,
            next,
        })
    } catch (error) {
        next(error)
    }
})

const validateParamLeadProviderProgram = asyncHandler(
    async (req, res, next) => {
        try {
            const user = req.user

            await validateLeadProviderProgram({
                req,
                user,
                leadProviderProgram: req.params.id,
                next,
            })
        } catch (error) {
            next(error)
        }
    }
)

const validateLeadProvider = asyncHandler(
    async ({ req, user, leadProvider, next }) => {
        try {
            const leadProviderDatum = await LeadProvider.findOne({
                where: {
                    id: leadProvider,
                    organization: {
                        [Op.in]: user.organizationIds,
                    },
                },
                include: [
                    {
                        model: User,
                        as: 'userLeadProviderDatum',
                        attributes: ['id', 'email'],
                    },
                ],
            })
            if (!leadProviderDatum)
                throw new AppError(httpStatus.UNAUTHORIZED, 'GLOBAL_E20')
            req.leadProvider = leadProviderDatum
            consoleLog({
                leadProviderDatum,
            })
            next()
        } catch (error) {
            next(error)
        }
    }
)

const validatePostLeadProvider = asyncHandler(async (req, res, next) => {
    try {
        const user = req.user

        await validateLeadProvider({
            req,
            user,
            leadProvider: req.body.leadProvider,
            next,
        })
    } catch (error) {
        next(error)
    }
})

const validateParamLeadProvider = asyncHandler(async (req, res, next) => {
    try {
        const user = req.user

        await validateLeadProvider({
            req,
            user,
            leadProviderProgram: req.params.id,
            next,
        })
    } catch (error) {
        next(error)
    }
})

const commissionItem = Joi.object({
    type: Joi.string().allow().required(),
    amount: Joi.number().required(),
    commissionBasis: Joi.string()
        .valid(...Object.values(COMMISSION_CALCULATION_TYPES))
        .required(),
})

const fileCheck = (req, res, next) => {
    try {
        if (req.files && req.files.length === 0)
            throw new AppError(httpStatus.PRECONDITION_FAILED, 'ASSET_E15')
        next()
    } catch (error) {
        next(error)
    }
}

export default {
    validate,
    validateUUID,
    validateEmail,
    validatePostOrganization,
    validateParamOrganization,
    validateParamUserOrganization,
    validatePostUserOrganization,
    validatePhoneNumber,
    validatePostLeadProviderProgram,
    validateParamLeadProviderProgram,
    validatePostLeadProvider,
    validateParamLeadProvider,
    commissionItem,
    validateLeadProvider,
    fileCheck,
}
