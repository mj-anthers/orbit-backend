import Joi from 'joi'
import commonValidate from './common-validate.middleware.js'
import { AppError } from '../utils/index.js'
import httpStatus from 'http-status'

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

const validateUploadSchema = (schema) => {
    return (req, res, next) => {
        const bodyValidation = schema.body?.validate(req.body)

        const errors = []
        if (bodyValidation?.error) errors.push(bodyValidation.error)

        if (errors.length > 0) {
            throw new AppError(httpStatus.PRECONDITION_FAILED, 'ASSET_E15')
        }

        req.body = bodyValidation?.value || req.body
        next()
    }
}
const assetsCreateValidate = commonValidate.validate(assetsCreateSchema)
const assetsIdValidate = commonValidate.validate(assetsIdSchema)
const assetsUpdateValidate = commonValidate.validate(assetsUpdateSchema)
const assetsUploadValidate = commonValidate.validate(validateUploadSchema)

export default {
    assetsCreateValidate,
    assetsIdValidate,
    assetsUpdateValidate,
    assetsUploadValidate,
}
