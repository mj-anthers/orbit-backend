import AWS from 'aws-sdk'
import { S3Client } from '@aws-sdk/client-s3'

if (process.env.NODE_ENV === 'development') {
    AWS.config.credentials = new AWS.SharedIniFileCredentials({
        profile: process.env.AWS_PROFILE,
    })
}

AWS.config.update({ region: process.env.AWS_REGION })

const s3 = new AWS.S3()

const EventBridge = new AWS.EventBridge()

export { s3, EventBridge }
