import Joi from 'joi'
import commonValidate from './common-validate.middleware.js'

const assetsBaseSchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required().messages({
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name cannot exceed 50 characters',
    }),
    userOrganization: commonValidate.validateUUID,
})

const assetsCreateSchema = {
    body: assetsBaseSchema,
}

const assetsIdSchema = {
    params: Joi.object({
        id: commonValidate.validateUUID,
    }),
}

const assetsUpdateSchema = {
    params: Joi.object({
        id: commonValidate.validateUUID,
    }),
    body: assetsBaseSchema,
}

const assetsCreateValidate = commonValidate.validate(assetsCreateSchema)
const assetsIdValidate = commonValidate.validate(assetsIdSchema)
const assetsUpdateValidate = commonValidate.validate(assetsUpdateSchema)

export default {
    assetsCreateValidate,
    assetsIdValidate,
    assetsUpdateValidate,
}
