import winston from 'winston'
import fs from 'fs'
import path from 'path'

const consoleLog = (...args) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(...args)
    }
}

const appLogger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: process.env.APP_NAME },
    transports: [
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
        }),
        new winston.transports.File({
            filename: 'logs/info.log',
            level: 'info',
        }),
        new winston.transports.File({
            filename: 'logs/api.log',
            level: 'api',
        }),
        new winston.transports.File({
            filename: 'logs/commission.log',
            level: 'commission',
        }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
})

if (process.env.NODE_ENV !== 'production') {
    appLogger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    )
}

const logFilePath = path.join(path.join('.', 'logs'), 'api.log')
const accessLogStream = fs.createWriteStream(logFilePath, { flags: 'a' })
const commissionLogStream = fs.createWriteStream(logFilePath, { flags: 'a' })

const routeLogFormat = (tokens, req, res) => {
    return JSON.stringify({
        level: 'http',
        timestamp: new Date().toISOString(),
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: parseInt(tokens.status(req, res)),
        responseTime: parseFloat(tokens['response-time'](req, res)) || 0,
        contentLength: parseInt(tokens.res(req, res, 'content-length')) || 0,
        headers: req.headers || {},
        query: req.query || {},
        body: req.body || {},
    })
}

const routeLogStream = {
    write: (line) => {
        if (process.env.NODE_ENV !== 'production') {
            consoleLog(line)
        }
        try {
            accessLogStream.write(line + '\n')
        } catch (err) {
            consoleLog(
                'Failed to write to log file: ' + err + '\n' + line + '\n'
            )
        }
    },
}

const commissionLog = (args) => {
    try {
        commissionLogStream.write(args)
    } catch (error) {
        appLogger.error(error)
    }
}

export { appLogger, routeLogFormat, routeLogStream, consoleLog, commissionLog }
