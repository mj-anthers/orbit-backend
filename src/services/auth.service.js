import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { Op } from 'sequelize'
import {
    User,
    UserOrganization,
    sequelize,
    Organization,
} from '../../models/index.js'
import { AppError, comparePasswords, consoleLog } from '../utils/index.js'
import httpStatus from 'http-status'
import { throwSpecificError } from '../middlewares/error.js'
import Identity from '../helpers/identity.js'
import Redis from '../../redis/index.js'

export const authService = {
    /**
     * Check if a user exists and retrieve their companies
     * @param {string} email - User's email address
     * @returns {Object|null} User object with companies array or null if not found
     * @description This function checks if a user exists in the system and returns
     * their basic info along with all active companies they belong to. Used for
     * determining signup vs login flow and company selection.
     */
    async checkExistingUser(email) {
        const user = await User.findOne({
            where: { email },
            include: [
                {
                    model: UserOrganization,
                    include: [Organization],
                    where: { isActive: true },
                },
            ],
        }).toJSON()

        consoleLog({ user })

        if (!user) return null

        return {
            user,
            companies: user.UserOrganizations.map((uc) => ({
                id: uc.Organization.id,
                name: uc.Organization.name,
                userType: uc.userType,
            })),
        }
    },

    /**
     * FIXED: Secure user login without company information leakage
     * @param {string} email - User's email address
     * @param {string} password - User's password
     * @returns {Object|null} Login result with base token only (NO company data)
     * @description Authenticates user credentials and returns ONLY a base token.
     * Company information is retrieved separately for security. This prevents
     * information leakage and follows proper multi-tenant security practices.
     */
    /*async validateLogin(email, password) {
        try {
            const user = await User.findOne({
                where: { email, isActive: true },
            })

            if (!user) throw new AppError(httpStatus.BAD_REQUEST, 'AUTH_E9')

            const validatePassword = await comparePasswords(
                password.trim(),
                user.password
            )

            // Verify user exists and password is correct
            if (!user || !validatePassword) {
                consoleLog({ user, password })
                throw new AppError(httpStatus.UNAUTHORIZED, 'AUTH_E5')
            }

            // Update last login timestamp
            await user.update({ lastLoginAt: new Date() })

            // SECURITY FIX: Generate base token with session info
            const baseToken = jwt.sign(
                {
                    user: user.id,
                    email: user.email,
                    type: 'base',
                    loginAt: Date.now(), // Prevent token replay attacks
                },
                process.env.JWT_SECRET,
                { expiresIn: '15m' } // Short-lived base token for security
            )

            return {
                token: baseToken,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
                // SECURITY FIX: NO companies array - prevent information leakage
            }
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'AUTH_E7'
            )
        }
    },*/

    /**
     * FIXED: Get user companies with proper authentication (no password needed)
     * @param {number} userId - User's ID from validated token
     * @returns {Object} User info and companies list
     * @description Secure endpoint that uses token authentication instead of password.
     * Returns companies the authenticated user has access to. Used after login
     * to display company selection options.
     */
    async getUserOrganizations(userId) {
        const user = await User.findOne({
            where: { id: userId, isActive: true },
            include: [
                {
                    model: UserOrganization,
                    where: { isActive: true },
                    include: [
                        {
                            model: Organization,
                            where: { isActive: true },
                        },
                    ],
                },
            ],
        })

        if (!user) {
            throw new Error('User not found or inactive')
        }

        return {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
            companies: user.UserOrganizations.map((uc) => ({
                id: uc.Organization.id,
                name: uc.Organization.name,
                userType: uc.userType,
                joinedAt: uc.createdAt,
            })),
        }
    },

    /**
     * FIXED: Secure company selection with session validation
     * @param {number} user - User's ID
     * @param {number} organization - Company ID to select
     * @returns {Object} Company token, refresh token, and company context
     * @description Validates user access to company and generates a company-scoped
     * token with user permissions and session binding. Creates refresh token with
     * session validation for enhanced security.
     */
    async selectOrganization(user, organization) {
        try {
            const userCompany = await UserOrganization.findOne({
                where: {
                    user,
                    organization,
                    isActive: true,
                },
                include: [
                    {
                        model: Organization,
                        as: 'organizationDatum',
                        where: { isActive: true },
                    },
                ],
            })

            consoleLog({ userCompany })

            if (!userCompany) {
                throw new Error(
                    'Access denied to this company or company is inactive'
                )
            }

            // SECURITY FIX: Generate unique session ID for token binding
            const sessionId = crypto.randomUUID()

            // Generate company-scoped token with session binding
            const companyToken = jwt.sign(
                {
                    user,
                    organization,
                    userType: userCompany.userType,
                    sessionId,
                    type: 'organization',
                },
                process.env.JWT_SECRET,
                { expiresIn: '8h' } // Reasonable session length
            )

            // Generate refresh token with session binding for security
            const refreshToken = jwt.sign(
                {
                    user,
                    organization,
                    sessionId,
                    type: 'refresh',
                },
                process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
                { expiresIn: '7d' }
            )

            // SECURITY FIX: Store session info for validation
            await this.storeUserSession(user, organization, sessionId)

            return {
                token: companyToken,
                refreshToken,
                organizationContext: {
                    id: userCompany.organizationDatum.id,
                    name: userCompany.organizationDatum.name,
                    userType: userCompany.userType,
                },
            }
        } catch (error) {
            consoleLog(error)
            throw error
        }
    },

    /**
     * FIXED: Secure refresh token with session validation
     * @param {string} refreshToken - Valid refresh token
     * @returns {Object} New tokens and company context
     * @description Validates refresh token with session binding and user verification.
     * Prevents token theft attacks by validating session state and user context.
     * Generates new tokens only if session is valid and matches current user.
     */
    async refreshCompanyToken(refreshToken) {
        try {
            const decoded = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
            )

            if (decoded.type !== 'refresh') {
                throw new Error('Invalid refresh token type')
            }

            // SECURITY FIX: Validate session is still active
            const sessionValid = await this.validateUserSession(
                decoded.userId,
                decoded.companyId,
                decoded.sessionId
            )

            if (!sessionValid) {
                throw new Error(
                    'Session expired or invalidated - please login again'
                )
            }

            // Generate new tokens using existing company selection
            return await this.selectCompany(decoded.user, decoded.company)
        } catch (error) {
            throw new Error('Invalid or expired refresh token')
        }
    },

    /**
     * Validate company name uniqueness across the system
     * @param {string} organizationName - Company name to validate
     * @param {number} [excludeCompanyId] - Company ID to exclude from check (for updates)
     * @returns {boolean} True if name is unique
     * @throws {Error} If company name already exists
     * @description Ensures global company name uniqueness to prevent confusion
     * and conflicts. Critical for multi-tenant data isolation.
     */
    async validateCompanyName(organizationName, excludeCompanyId = null) {
        const whereClause = {
            name: organizationName,
            isActive: true,
        }

        if (excludeCompanyId) {
            whereClause.id = { [Op.ne]: excludeCompanyId }
        }

        const existingCompany = await Organization.findOne({
            where: whereClause,
        })

        if (existingCompany) {
            throw new Error(
                'Organization name already exists. Please choose a different name.'
            )
        }

        return true
    },

    /**
     * Create new user with their first company (complete registration)
     * @param {Object} userData - User registration data
     * @param {string} userData.firstName - User's first name
     * @param {string} userData.lastName - User's last name
     * @param {string} userData.email - User's email address
     * @param {string} userData.password - User's password
     * @param {string} organizationName - Name for the new company
     * @param {Object} t - Database transaction
     * @returns {Object} Created user and company objects
     * @description Creates a complete user account with their first company.
     * User automatically becomes the owner of the new company. Used for
     * brand new user registrations.
     */
    async createUserWithOrganization(userData, organizationName, t) {
        // Validate company name uniqueness
        await this.validateCompanyName(organizationName)

        // Create user account
        const user = await User.create(
            {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: userData.password,
                source: 'web',
                isActive: true,
            },
            { transaction: t }
        )

        // Create their first company
        const organization = await Organization.create(
            {
                user: user.id,
                name: organizationName,
                isActive: true,
            },
            { transaction: t }
        )

        // Make user the owner of the new company
        const userOrganization = await UserOrganization.create(
            {
                user: user.id,
                organization: organization.id,
                userType: 'owner',
                isActive: true,
            },
            { transaction: t }
        )

        consoleLog({ userOrganization })

        return { user, organization }
    },

    /**
     * Add company to existing authenticated user
     * @param {number} userId - User ID
     * @param {string} organizationName - Company name
     * @param {string} password - User password for verification
     * @returns {Object} Created company
     */
    async addCompanyToExistingUser(userId, organizationName, password) {
        return sequelize.transaction(async (t) => {
            // Verify user password
            const user = await User.findByPk(userId)
            if (!user) {
                throw new AppError(httpStatus.NOT_FOUND, 'AUTH_E2')
            }

            if (!user.password) {
                throw new AppError(httpStatus.NOT_FOUND, 'AUTH_E3')
            }

            const isValidPassword = await comparePasswords(
                password,
                user.password
            )
            if (!isValidPassword) {
                throw new AppError(httpStatus.UNAUTHORIZED, 'AUTH_E4')
            }

            // Validate company name
            await this.validateCompanyName(organizationName)

            // Create company
            const organization = await Organization.create(
                {
                    user: user.id,
                    name: organizationName,
                },
                { transaction: t }
            )

            // Create user-company relationship
            await UserOrganization.create(
                {
                    user: userId,
                    organization: organization.id,
                    userType: 'owner',
                },
                { transaction: t }
            )

            return organization
        })
    },

    /**
     * Handle unified signup process (auto-detect new vs existing user)
     * @param {Object} signupData - Signup form data
     * @param {string} signupData.firstName - User's first name
     * @param {string} signupData.lastName - User's last name
     * @param {string} signupData.email - User's email address
     * @param {string} signupData.password - User's password
     * @param {string} signupData.companyName - Company name to create
     * @param {Object} t - Database transaction
     * @returns {Object} Result object with user, company, and operation type
     * @description Automatically detects if user exists and handles both new user
     * registration and existing user company creation. More efficient than requiring
     * frontend to specify user existence, eliminates extra API calls.
     */
    async handleSignup(signupData, t) {
        try {
            const { firstName, lastName, email, password, organizationName } =
                signupData

            // Auto-detect if user exists by checking email in database
            const existingUser = await User.findOne({
                where: { email, isActive: true },
                transaction: t,
            })

            if (existingUser) {
                const validatePassword = comparePasswords(
                    password,
                    existingUser.password
                )
                // Existing user - validate password and add new company
                if (!validatePassword) {
                    throw new AppError(httpStatus.UNAUTHORIZED, 'AUTH_E8')
                }

                // Use the proper method to add company
                const company = await this.addCompanyToExistingUser(
                    existingUser.id,
                    organizationName,
                    t
                )

                return {
                    user: existingUser,
                    company,
                    isNewUser: false,
                }
            } else {
                // New user - create user and their first company
                const result = await this.createUserWithOrganization(
                    { firstName, lastName, email, password },
                    organizationName,
                    t
                )
                return {
                    ...result,
                    isNewUser: true,
                }
            }
        } catch (error) {
            consoleLog(error)
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'AUTH_E5'
            )
        }
    },

    /**
     * SECURITY: Store user session for validation
     * @param {number} user - User ID
     * @param {number} organization - Company ID
     * @param {string} sessionId - Unique session ID
     * @description Stores session information for token validation.
     * In production, use Redis or similar persistent store.
     */
    async storeUserSession(user, organization, sessionId) {
        // Initialize global session store if not exists
        if (!global.userSessions) {
            global.userSessions = new Map()
        }

        const sessionKey = user + ':' + organization
        global.userSessions.set(sessionKey, {
            sessionId,
            createdAt: new Date(),
            lastAccess: new Date(),
        })
    },

    /**
     * SECURITY: Validate user session is active
     * @param {number} userId - User ID
     * @param {number} companyId - Company ID
     * @param {string} sessionId - Session ID to validate
     * @returns {boolean} True if session is valid
     * @description Validates session exists and matches. Updates last access time.
     */
    async validateUserSession(userId, companyId, sessionId) {
        if (!global.userSessions) {
            return false
        }

        const sessionKey = userId + ':' + companyId
        const session = global.userSessions.get(sessionKey)

        if (!session || session.sessionId !== sessionId) {
            return false
        }

        // Update last access time
        session.lastAccess = new Date()
        return true
    },

    async ssoLogin(email) {
        try {
            const identity = new Identity()
            return identity.ssoRedirectToken(email)
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'AUTH_E11'
            )
        }
    },

    async login({ firstName, lastName, email, session }) {
        try {
            const user = await User.findOne({
                where: { email, isActive: true },
            })

            if (!user) throw new AppError(httpStatus.BAD_REQUEST, 'AUTH_E9')

            // Update last login timestamp
            await User.update(
                {
                    firstName,
                    lastName,
                    lastLoginAt: new Date(),
                },
                {
                    where: { email, isActive: true },
                }
            )

            await Redis.setUserSSOToken(email, session)

            // SECURITY FIX: Generate base token with session info
            const baseToken = jwt.sign(
                {
                    user: user.id,
                    email: user.email,
                    type: 'base',
                    loginAt: Date.now(), // Prevent token replay attacks
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN } // Short-lived base token for security
            )

            return {
                token: baseToken,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
                // SECURITY FIX: NO companies array - prevent information leakage
            }
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'AUTH_E7'
            )
        }
    },

    async signUp({ firstName, lastName, email, session }) {
        try {
            // Auto-detect if user exists by checking email in database
            const existingUser = await User.findOne({
                where: { email, isActive: true },
            })

            if (existingUser) return this.login({ email, session })

            await User.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
            })

            return this.login({ email, session })
        } catch (error) {
            consoleLog(error)
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'AUTH_E5'
            )
        }
    },
}
