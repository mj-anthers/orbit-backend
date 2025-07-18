import Joi from 'joi'
import commonValidate from './common-validate.middleware.js'
import {
    LEAD_PROVIDER_PROGRAM_BASE_RULE_ENUM,
    LEAD_PROVIDER_PROGRAM_CONDITION_OPERATOR_ENUM,
    LEAD_PROVIDER_PROGRAM_TYPE_ENUM,
} from '../../models/index.js'

const leadProviderProgramConditionBaseSchema = Joi.object({
    type: Joi.string().required(),
    operator: Joi.string()
        .valid(...Object.values(LEAD_PROVIDER_PROGRAM_CONDITION_OPERATOR_ENUM))
        .required(),
    values: Joi.array()
        .items(Joi.string(), Joi.number(), Joi.bool())
        .required(),
})

const leadProviderProgramBaseSchema = Joi.object({
    title: Joi.string().trim().min(2).max(250).required().messages({
        'string.min': 'Title must be at least 2 characters',
        'string.max': 'Title cannot exceed 250 characters',
    }),
    userOrganization: commonValidate.validateUUID,
    baseRule: Joi.string()
        .valid(
            LEAD_PROVIDER_PROGRAM_BASE_RULE_ENUM.ANY,
            LEAD_PROVIDER_PROGRAM_BASE_RULE_ENUM.ALL
        )
        .required(),
    conditions: Joi.array()
        .items(leadProviderProgramConditionBaseSchema)
        .required(),
    commissionPerInstall: Joi.number().required().allow(0),
    commissionType: Joi.string().allow(
        ...Object.values(LEAD_PROVIDER_PROGRAM_TYPE_ENUM)
    ),
    commissionValue: Joi.number().required().allow(0),
    commissionNeverExpire: Joi.bool().required(),
    commissionDuration: Joi.number().required().allow(0),
    commissionBase: Joi.string()
        .allow(...Object.values(LEAD_PROVIDER_PROGRAM_BASE_RULE_ENUM))
        .required(),
    leadProviderProgramRequiresApproval: Joi.bool().required(),
    uninstallationEvent: Joi.string().allow().required(),
    uninstallationDuration: Joi.number().required().allow(0),
})

const leadProviderProgramCreateSchema = {
    body: leadProviderProgramBaseSchema,
}

const leadProviderProgramIdSchema = {
    params: Joi.object({
        id: commonValidate.validateUUID,
    }),
}

const leadProviderProgramUpdateSchema = {
    params: Joi.object({
        id: commonValidate.validateUUID,
    }),
    body: leadProviderProgramBaseSchema,
}

const leadProviderProgramCreateValidate = commonValidate.validate(
    leadProviderProgramCreateSchema
)
const leadProviderProgramIdValidate = commonValidate.validate(
    leadProviderProgramIdSchema
)
const leadProviderProgramUpdateValidate = commonValidate.validate(
    leadProviderProgramUpdateSchema
)
/**
 * Generic validation middleware factory
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */

export default {
    leadProviderProgramCreateValidate,
    leadProviderProgramIdValidate,
    leadProviderProgramUpdateValidate,
}
