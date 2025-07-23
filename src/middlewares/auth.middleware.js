import jwt from 'jsonwebtoken'
import { User, UserOrganization, Organization } from '../../models/index.js'
import ResponseHandler from '../utils/response-handler.js'
import { AppError, consoleLog } from '../utils/index.js'
import httpStatus from 'http-status'
import http from 'http'

/**
 * Authentication middleware - validates JWT tokens
 * Supports both base tokens (user-only) and company tokens (user + company context)
 */
export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'GLOBAL_E5')
        }

        const token = authHeader.split(' ')[1]
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'GLOBAL_E9')
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        consoleLog(decoded)

        const user = await User.findOne({
            where: {
                id: decoded.user,
                isActive: true,
            },
            include: [
                {
                    model: UserOrganization,
                    required: false,
                    where: { isActive: true },
                    as: 'userOrganizations',
                    include: [
                        {
                            model: Organization,
                            as: 'organizationDatum',
                            where: { isActive: true },
                        },
                    ],
                },
            ],
        })

        consoleLog(user)

        if (!user) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'GLOBAL_E10')
        }

        req.user = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userOrganizations: user.userOrganizations,
            organizationIds: user.userOrganizations.map(
                (datum) => datum.organization
            ),
            userOrganizationIds: user.userOrganizations.map(
                (datum) => datum.id
            ),
        }
        next()
    } catch (error) {
        next(error)
    }
}

// Middleware to handle token refresh attempts
export const refreshTokenMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        // If no token provided, proceed normally
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next()
        }

        const token = authHeader.split(' ')[1]

        try {
            jwt.verify(token, process.env.JWT_SECRET)
            // Token is valid, proceed normally
            return next()
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                // Token expired, but check if refresh token is available
                const refreshToken = req.headers['x-refresh-token']
                if (refreshToken) {
                    return ResponseHandler.fail(
                        req,
                        res,
                        'GLOBAL_E6',
                        httpStatus.UNAUTHORIZED,
                        {
                            refreshRequired: true,
                        }
                    )
                }
            }
            // Other token errors, proceed to normal auth middleware
            return next()
        }
    } catch (error) {
        next(error)
    }
}
