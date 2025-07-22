import { sequelize } from '../../models/index.js'
import { authService } from '../services/auth.service.js'
import ResponseHandler from '../utils/response-handler.js'
import { throwSpecificError } from '../middlewares/error.js'
import httpStatus from 'http-status'
import { asyncHandler } from '../utils/index.js'

/**
 * Check if email exists in the system (for frontend flow decisions)
 * @route POST /api/auth/check-email
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - Email address to check
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with existence status
 * @description Security-conscious endpoint that only reveals if an email exists,
 * without exposing company details. Used by frontend to determine whether to show
 * signup vs login flow. Previous security vulnerability has been fixed.
 */
export const checkEmail = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body
        // Normalize email (lowercase and trim)
        const normalizedEmail = email.toLowerCase().trim()
        const result = await authService.checkExistingUser(normalizedEmail)

        // SECURITY FIX: Only return existence, not company details
        return ResponseHandler.success(res, {
            exists: !!result,
            message: result
                ? 'Email already registered'
                : 'Email not registered',
        })
    } catch (error) {
        return ResponseHandler.fail(res, error.message, 500)
    }
})

/**
 * Refresh expired company token using refresh token
 * @route POST /api/auth/refresh-token
 * @access Public
 * @param {string} req.body.refreshToken - Valid refresh token
 * @returns {Object} JSON response with new tokens
 * @description Generates new access tokens using refresh token without requiring
 * re-authentication. Maintains user session continuity.
 * Uses long-lived refresh tokens (7 days) to generate new
 * short-lived access tokens (24 hours). Critical for good user experience.
 */
export const refreshToken = asyncHandler(async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken

        if (!refreshToken) {
            return ResponseHandler.fail(
                req,
                res,
                'Refresh token not found',
                401
            )
        }

        const result = await authService.refreshCompanyToken(refreshToken)

        // Set the new refresh token in the cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // Or 'lax' depending on your needs
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/api/auth/refresh-token',
        })

        // Return the new access token in the response body
        return ResponseHandler.success(
            res,
            {
                token: result.token,
                organizationContext: result.organizationContext,
            },
            'Token refreshed successfully'
        )
    } catch (error) {
        throwSpecificError(error, httpStatus.INTERNAL_SERVER_ERROR, 'AUTH_E3')
    }
})

/**
 * Register new user or create additional company for existing user (auto-detected)
 * @route POST /api/auth/signup
 * @access Public
 * @param {string} req.body.firstName - User first name
 * @param {string} req.body.lastName - User last name
 * @param {string} req.body.email - User email
 * @param {string} req.body.password - User password
 * @param {string} req.body.companyName - Company name to create
 * @returns {Object} JSON response with tokens and user data
 * @description Intelligent signup endpoint that automatically detects if the email
 * belongs to an existing user or is new. For existing users, validates password and
 * creates a new company. For new users, creates both user and company. Uses database
 * transactions for data consistency and eliminates need for frontend pre-checks.
 */
export const signup = asyncHandler(async (req, res) => {
    const t = await sequelize.transaction()

    try {
        const { firstName, lastName, email, password, organizationName } =
            req.body
        // Normalize email for consistency
        const normalizedEmail = email.toLowerCase().trim()

        const result = await authService.handleSignup(
            {
                firstName,
                lastName,
                email: normalizedEmail,
                password,
                organizationName,
            },
            t
        )

        await t.commit()

        // Automatically select the new company and generate tokens
        const companyResult = await authService.selectOrganization(
            result.user.id,
            result.organization.id
        )

        return ResponseHandler.success(req, res, {
            code: httpStatus.CREATED,
            messageCode: 'AUTH_S1',
            data: {
                company: result.company,
                user: {
                    id: result.user.id,
                    firstName: result.user.firstName,
                    lastName: result.user.lastName,
                    email: result.user.email,
                },
                ...companyResult,
                isNewUser: result.isNewUser,
            },
        })
    } catch (error) {
        await t.rollback()

        throwSpecificError(error, httpStatus.INTERNAL_SERVER_ERROR, 'AUTH_E2')
    }
})

/**
 * Authenticate user and return base token with available companies
 * @route POST /api/auth/login
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with base token and companies list
 * @description First step of two-factor auth flow. Validates credentials and returns
 * a base token (no company context) plus list of available companies. User must
 * then select a company to get a company-scoped token.
 */
export const login = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body
        // Normalize email for consistency
        const normalizedEmail = email.toLowerCase().trim()
        const result = await authService.validateLogin(
            normalizedEmail,
            password
        )
        return ResponseHandler.success(req, res, {
            code: httpStatus.OK,
            messageCode: 'AUTH_S2',
            data: result,
        })
    } catch (error) {
        throwSpecificError(error, httpStatus.INTERNAL_SERVER_ERROR, 'AUTH_E6')
    }
})

/**
 * Logout user and clear refresh token
 * @route POST /api/auth/logout
 * @access Public
 * @returns {Object} JSON response with success status
 * @description Clears refresh token cookie and logs out user.
 */
export const logout = asyncHandler((req, res) => {
    try {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/api/auth/refresh-token',
        })
        return ResponseHandler.success(res, null, 'Logged out successfully')
    } catch (error) {
        throwSpecificError(error, httpStatus.INTERNAL_SERVER_ERROR, 'AUTH_E3')
    }
})

export const sso = asyncHandler(async (req, res) => {
    try {
        const data = await authService.ssoLogin(req.body.email)
        return ResponseHandler.success(req, res, {
            code: httpStatus.OK,
            messageCode: 'AUTH_S2',
            data,
        })
    } catch (error) {
        throwSpecificError(error, httpStatus.INTERNAL_SERVER_ERROR, 'AUTH_E10')
    }
})
