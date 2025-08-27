import Joi from 'joi'
import commonValidate from './common-validate.middleware.js'

const notificationBaseSchema = Joi.object({
    event: Joi.string().required(),
    organization: commonValidate.validateUUID,
    template: Joi.string().required(),
})

const notificationCreateSchema = {
    body: notificationBaseSchema,
}

const notificationIdSchema = {
    params: Joi.object({
        id: commonValidate.validateUUID,
    }),
}

const notificationUpdateSchema = {
    params: Joi.object({
        id: commonValidate.validateUUID,
    }),
    body: Joi.object({
        template: Joi.string().required(),
    }),
}

const notificationCreateValidate = commonValidate.validate(
    notificationCreateSchema
)
const notificationIdValidate = commonValidate.validate(notificationIdSchema)
const notificationUpdateValidate = commonValidate.validate(
    notificationUpdateSchema
)

export default {
    notificationCreateValidate,
    notificationIdValidate,
    notificationUpdateValidate,
}
