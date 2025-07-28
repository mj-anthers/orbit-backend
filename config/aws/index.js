import 'dotenv/config.js'
import { S3Client } from '@aws-sdk/client-s3'
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'
import { fromIni } from '@aws-sdk/credential-provider-ini'

const sharedConfig = {
    region: process.env.AWS_REGION,
    credentials:
        process.env.SERVER_NAME === 'local'
            ? fromIni({ profile: process.env.AWS_PROFILE })
            : undefined,
}

const s3 = new S3Client(sharedConfig)
const snsClient = new SNSClient(sharedConfig)
const snsPublish = PublishCommand

export { s3, snsClient, snsPublish }
