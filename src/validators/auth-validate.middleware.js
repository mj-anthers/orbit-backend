import Joi from 'joi'
import commonValidate from './common-validate.middleware.js'

/**
 * Validation schema for user registration (optimized - no isExistingUser needed)
 * @description Validates registration data for both new users and existing users
 * creating additional companies. The backend auto-detects user existence.
 */

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])/

const signupSchema = {
    body: Joi.object({
        firstName: Joi.string().trim().min(2).max(50).required().messages({
            'string.min': 'First name must be at least 2 characters',
            'string.max': 'First name cannot exceed 50 characters',
        }),
        lastName: Joi.string().trim().min(2).max(50).required().messages({
            'string.min': 'Last name must be at least 2 characters',
            'string.max': 'Last name cannot exceed 50 characters',
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Please provide a valid email address',
        }),
        password: Joi.string()
            .min(8)
            .max(128)
            .required()
            .pattern(passwordRegex)
            .messages({
                'string.min': 'Password must be at least 8 characters',
                'string.pattern.base':
                    'Password must contain uppercase, lowercase, number and special character',
            }),
        organizationName: Joi.string()
            .trim()
            .min(2)
            .max(100)
            .required()
            .messages({
                'string.min': 'Organization name must be at least 2 characters',
                'string.max': 'Organization name cannot exceed 100 characters',
            }),
    }),
}

const loginSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
}

const emailCheckSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
    }),
}

const selectOrganizationSchema = {
    params: Joi.object({
        id: commonValidate.validateUUID,
    }),
}

const addOrganizationSchema = {
    body: Joi.object({
        organizationName: Joi.string().trim().min(2).max(100).required(),
        password: Joi.string().required(),
    }),
}

const forgotPasswordSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
    }),
}

const resetPasswordSchema = {
    body: Joi.object({
        resetToken: Joi.string().required(),
        newPassword: Joi.string()
            .min(8)
            .max(128)
            .required()
            .pattern(passwordRegex),
    }),
}

const createOrganizationWithResetSchema = {
    body: Joi.object({
        email: commonValidate.validateEmail,
        resetToken: Joi.string().required(),
        organizationName: Joi.string().trim().min(2).max(100).required(),
        newPassword: Joi.string()
            .min(8)
            .max(128)
            .required()
            .pattern(passwordRegex),
    }),
}

const setupInvitationSchema = {
    body: Joi.object({
        invitationToken: Joi.string().required(),
        password: Joi.string()
            .min(8)
            .max(128)
            .required()
            .pattern(passwordRegex)
            .messages({
                'string.min': 'Password must be at least 8 characters',
                'string.pattern.base':
                    'Password must contain uppercase, lowercase, number and special character',
            }),
    }),
}

// Export individual validation middlewares
export const validateCheckEmail = commonValidate.validate(emailCheckSchema)
export const validateSignup = commonValidate.validate(signupSchema)
export const validateLogin = commonValidate.validate(loginSchema)
export const validateSelectOrganization = commonValidate.validate(
    selectOrganizationSchema
)
export const validateAddCompany = commonValidate.validate(addOrganizationSchema)
export const validateForgotPassword =
    commonValidate.validate(forgotPasswordSchema)
export const validateResetPassword =
    commonValidate.validate(resetPasswordSchema)
export const validateCreateCompanyWithReset = commonValidate.validate(
    createOrganizationWithResetSchema
)
export const validateSetupInvitation = commonValidate.validate(
    setupInvitationSchema
)

// Aliases for backward compatibility
export const validateCheckUser = commonValidate.validate(emailCheckSchema)
