import Joi from 'joi'
import commonValidate from './common-validate.middleware.js'

const organizationSettingSchema = {
    body: Joi.object({
        formData: Joi.object().allow(null).required(),
    }),
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
    body: organizationSettingSchema,
}

const organizationIdValidate = commonValidate.validate(organizationIdSchema)

const organizationUpdateValidate = commonValidate.validate(
    organizationUpdateSchema
)

export default {
    organizationIdValidate,
    organizationUpdateValidate,
}
