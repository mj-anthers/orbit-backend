import httpStatus from 'http-status'
import { AppError, appLogger, ResponseHandler } from '../utils/index.js'

export const errorConverter = (err, req, res, next) => {
    let error = err
    appLogger.error(err.stack)

    if (!(error instanceof AppError)) {
        const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
        const messageCode = error.messageCode || 'GLOBAL_E1'
        const message =
            (process.env.NODE_ENV === 'development' ? error.message : '') ||
            httpStatus[statusCode]
        const data = error.data || null
        error = new AppError(
            statusCode,
            messageCode,
            message,
            data,
            false,
            err.stack
        )
    }
    next(error)
}

export const errorHandler = (err, req, res, next) => {
    //const { statusCode, messageCode, message, data } = err
    const { statusCode, messageCode, message, data } = err
    ResponseHandler.fail(
        req,
        res,
        message,
        {
            code: statusCode,
            messageCode,
        },
        data
    )
}

export const throwSpecificError = (error, httpCode, messageCode, data) => {
    if (error === null || error === undefined) {
        throw new AppError(
            httpCode,
            messageCode,
            data || 'An unknown error occurred'
        )
    }

    if (error instanceof AppError) {
        throw error
    }
    throw new AppError(
        httpCode,
        messageCode,
        data || error.message || 'An unknown error occurred'
    )
}
