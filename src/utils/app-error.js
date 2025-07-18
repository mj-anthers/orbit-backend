class AppError extends Error {
    constructor(
        statusCode,
        messageCode,
        message = null,
        data = null,
        isOperational = true,
        stack = ''
    ) {
        super(messageCode)
        this.statusCode = statusCode
        this.messageCode = messageCode
        this.server = process.env.SERVER_NAME
        this.isOperational = isOperational
        this.message = message
        this.data = data
        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default AppError
