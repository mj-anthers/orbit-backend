import Joi from 'joi'
import commonValidate from './common-validate.middleware.js'

const leadProviderMetaBaseSchema = Joi.object({
    taxInfo: Joi.string().required().allow(null),
})

const leadProviderMetaIdSchema = {
    params: Joi.object({
        id: commonValidate.validateUUID,
    }),
}

const leadProviderMetaUpdateSchema = {
    params: Joi.object({
        id: commonValidate.validateUUID,
    }),
    body: leadProviderMetaBaseSchema,
}

const leadProviderMetaIdValidate = commonValidate.validate(
    leadProviderMetaIdSchema
)
const leadProviderMetaUpdateValidate = commonValidate.validate(
    leadProviderMetaUpdateSchema
)
/**
 * Generic validation middleware factory
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */

export default {
    leadProviderMetaIdValidate,
    leadProviderMetaUpdateValidate,
}
