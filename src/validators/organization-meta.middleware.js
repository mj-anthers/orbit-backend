import Joi from 'joi'
import commonValidate from './common-validate.middleware.js'

const organizationMetaBaseSchema = Joi.object({
    taxInfo: Joi.string().required().allow(null),
})

const organizationMetaMetaIdSchema = {
    params: Joi.object({
        id: commonValidate.validateUUID,
    }),
}

const organizationMetaUpdateSchema = {
    params: Joi.object({
        id: commonValidate.validateUUID,
    }),
    body: organizationMetaBaseSchema,
}

const organizationMetaIdValidate = commonValidate.validate(
    organizationMetaMetaIdSchema
)
const organizationMetaUpdateValidate = commonValidate.validate(
    organizationMetaUpdateSchema
)
/**
 * Generic validation middleware factory
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */

export default {
    organizationMetaIdValidate,
    organizationMetaUpdateValidate,
}
