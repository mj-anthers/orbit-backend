import Joi from 'joi'
import commonValidate from './common-validate.middleware.js'
import { ORGANIZATION_TYPES } from '../../models/index.js'

const organizationBaseSchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required().messages({
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name cannot exceed 50 characters',
    }),
    type: Joi.string()
        .valid(...Object.values(ORGANIZATION_TYPES))
        .required(),
    websiteURL: Joi.string().optional(),
    supportEmail: Joi.string().email().optional(),
    timezone: Joi.string().optional(),
})

const organizationCreateSchema = {
    body: organizationBaseSchema,
}

const organizationIdSchema = {
    params: Joi.object({
        id: commonValidate.validateUUID,
    }),
}

const organizationUpdateSchema = {
    params: Joi.object({
        id: commonValidate.validateUUID,
    }),
    body: organizationBaseSchema,
}

const organizationCreateValidate = commonValidate.validate(
    organizationCreateSchema
)
const organizationIdValidate = commonValidate.validate(organizationIdSchema)
const organizationUpdateValidate = commonValidate.validate(
    organizationUpdateSchema
)

export default {
    organizationCreateValidate,
    organizationIdValidate,
    organizationUpdateValidate,
}
