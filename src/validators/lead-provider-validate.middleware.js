import Joi from 'joi'
import commonValidate from './common-validate.middleware.js'
import { User } from '../../models/index.js'

const leadProviderBaseSchema = Joi.object({
    email: commonValidate.validateEmail,
    userOrganization: commonValidate.validateUUID,
})

const leadProviderCreateSchema = {
    body: leadProviderBaseSchema,
}

const leadProviderIdSchema = {
    params: Joi.object({
        id: commonValidate.validateUUID,
    }),
}

const leadProviderUpdateSchema = {
    params: Joi.object({
        id: commonValidate.validateUUID,
    }),
    body: {
        userOrganization: commonValidate.validateUUID,
    },
}

const leadProviderUserValidate = async (req, res, next) => {
    try {
        const [record] = await User.findOrCreate({
            where: {
                email: req.body.email,
            },
            defaults: {
                email: req.body.email,
                isActive: false,
            },
        })
        req.leadProviderUser = record
        next()
    } catch (error) {
        next(error)
    }
}

const leadProviderCreateValidate = commonValidate.validate(
    leadProviderCreateSchema
)
const leadProviderIdValidate = commonValidate.validate(leadProviderIdSchema)
const leadProviderUpdateValidate = commonValidate.validate(
    leadProviderUpdateSchema
)
/**
 * Generic validation middleware factory
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */

export default {
    leadProviderCreateValidate,
    leadProviderIdValidate,
    leadProviderUpdateValidate,
    leadProviderUserValidate,
}
