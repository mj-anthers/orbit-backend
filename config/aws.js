import { S3Client } from '@aws-sdk/client-s3'
import { EventBridgeClient } from '@aws-sdk/client-eventbridge'
import { SchedulerClient } from '@aws-sdk/client-scheduler'
import { fromIni } from '@aws-sdk/credential-provider-ini'

const sharedConfig = {
    region: process.env.AWS_REGION,
    credentials:
        process.env.SERVER_NAME === 'local'
            ? fromIni({ profile: process.env.AWS_PROFILE })
            : undefined,
}

const s3 = new S3Client(sharedConfig)
const eventBridge = new EventBridgeClient(sharedConfig)
const schedulerClient = new SchedulerClient(sharedConfig)

export { s3, eventBridge, schedulerClient }
