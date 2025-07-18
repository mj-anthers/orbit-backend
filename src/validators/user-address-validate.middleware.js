import Joi from 'joi'
import { ADDRESS_TYPE_ENUM } from '../../models/enum.js'
import commonValidate from './common-validate.middleware.js'

// Extract enum values for Joi
const addressTypes = Object.values(ADDRESS_TYPE_ENUM)

const userAddressBaseSchema = Joi.object({
    type: Joi.string()
        .valid(...addressTypes)
        .default(ADDRESS_TYPE_ENUM.PRIMARY),
    addressLine1: Joi.string().trim().required(),
    addressLine2: Joi.string().trim().optional().allow(null, ''),

    city: Joi.string().trim().required(),
    province: Joi.string().trim().required(),
    postalCode: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
})

const userCreateAddressSchema = {
    body: userAddressBaseSchema,
}

const userAddressIdSchema = Joi.object({
    params: Joi.object({
        id: Joi.string().required(),
    }),
})

const userAddressUpdateSchema = {
    params: Joi.object({
        id: Joi.string().required(),
    }),
    body: userAddressBaseSchema,
}

const userAddressCreateValidate = commonValidate.validate(
    userCreateAddressSchema
)
const userAddressIdValidate = commonValidate.validate(userAddressIdSchema)
const userAddressUpdateValidate = commonValidate.validate(
    userAddressUpdateSchema
)

export default {
    userAddressCreateValidate,
    userAddressIdValidate,
    userAddressUpdateValidate,
}
