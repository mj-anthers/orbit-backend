import globalError from '../../config/response-handler/responseCodes.js'
import httpStatus from 'http-status'

/**
 * @fileoverview Standardized response handler utility
 * @description Provides consistent API response structure across all endpoints
 */

class ResponseHandler {
    static message = (req, code) => globalError.en[code]

    static validateError = (code) => {
        return !Number.isInteger(code) || code < 100 || code > 599
            ? httpStatus.INTERNAL_SERVER_ERROR
            : code
    }

    static success = (req, res, obj) => {
        const { code, messageCode, data } = obj
        const returnObject = {
            status: true,
            messageCode,
            message: this.message(req, messageCode),
            data,
        }
        return res
            .status(code)
            .set(
                'x-request-id',
                req['x-request-id'] || req.headers['x-request-id']
            )
            .json(returnObject)
    }

    /**
     * Send error response
     * @param req req - Express request object
     * @param {Object} res - Express response object
     * @param customMessage - Custom error message
     * @param error - error object
     * @param data - Any data type to return
     */
    static fail(req, res, customMessage, error, data = null) {
        const { code, messageCode } = error
        const returnObject = {
            status: false,
            messageCode,
            message: customMessage || this.message(req, messageCode),
            data,
        }
        return res
            .status(this.validateError(code))
            .set(
                'x-request-id',
                req['x-request-id'] || req.headers['x-request-id']
            )
            .json(returnObject)
    }

    /**
     * Send validation error response
     * @param req - Express request object
     * @param {Object} res - Express response object
     * @param {string} message - Validation error message
     */
    static validationError(req, res, message = 'Validation failed') {
        return this.fail(
            req,
            res,
            message,
            {
                code: httpStatus.BAD_REQUEST,
                messageCode: 'GLOBAL_E4',
            },
            null
        )
    }
}

export default ResponseHandler
