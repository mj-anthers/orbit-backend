import Joi from 'joi'
import commonValidate from './common-validate.middleware.js'

const leadProviderCommentBaseSchema = Joi.object({
    userOrganization: commonValidate.validateUUID,
    leadProvider: commonValidate.validateUUID,
    comment: Joi.string().trim().min(2).max(1000).required(),
})

const leadProviderCommentCreateSchema = {
    body: leadProviderCommentBaseSchema,
}

const leadProviderCommentIdSchema = {
    params: Joi.object({
        id: commonValidate.validateUUID,
    }),
}

const leadProviderCommentUpdateSchema = {
    params: Joi.object({
        id: commonValidate.validateUUID,
    }),
    body: {
        comment: Joi.string().trim().min(2).max(1000).required(),
    },
}

const leadProviderCommentCreateValidate = commonValidate.validate(
    leadProviderCommentCreateSchema
)
const leadProviderCommentIdValidate = commonValidate.validate(
    leadProviderCommentIdSchema
)
const leadProviderCommentUpdateValidate = commonValidate.validate(
    leadProviderCommentUpdateSchema
)

export default {
    leadProviderCommentCreateValidate,
    leadProviderCommentIdValidate,
    leadProviderCommentUpdateValidate,
}
