import Joi from 'joi'
import { ADDRESS_TYPE_ENUM } from '../../models/enum.js'
import commonValidate from './common-validate.middleware.js'

// Extract enum values for Joi
const addressTypes = Object.values(ADDRESS_TYPE_ENUM)

const organizationAddressBaseSchema = Joi.object({
    type: Joi.string()
        .valid(...addressTypes)
        .default(ADDRESS_TYPE_ENUM.PRIMARY),
    userOrganization: commonValidate.validateUUID,
    addressLine1: Joi.string().trim().required(),
    addressLine2: Joi.string().trim().optional().allow(null, ''),
    city: Joi.string().trim().required(),
    province: Joi.string().trim().required(),
    postalCode: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
})

const organizationCreateAddressSchema = {
    body: organizationAddressBaseSchema,
}

const organizationAddressIdSchema = Joi.object({
    params: Joi.object({
        id: Joi.string().required(),
    }),
})

const organizationAddressUpdateSchema = {
    params: Joi.object({
        id: Joi.string().required(),
    }),
    body: organizationAddressBaseSchema,
}

const organizationAddressCreateValidate = commonValidate.validate(
    organizationCreateAddressSchema
)
const organizationAddressIdValidate = commonValidate.validate(
    organizationAddressIdSchema
)
const organizationAddressValidate = commonValidate.validate(
    organizationAddressUpdateSchema
)

export default {
    organizationAddressCreateValidate,
    organizationAddressIdValidate,
    organizationAddressValidate,
}
