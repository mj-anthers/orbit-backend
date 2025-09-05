import Joi from 'joi'
import commonValidate from './common-validate.middleware.js'

const organizationSettingSchema = Joi.object({
    formData: Joi.array().required(),
})

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
