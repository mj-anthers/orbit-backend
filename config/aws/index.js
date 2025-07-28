import 'dotenv/config.js'
import { S3Client } from '@aws-sdk/client-s3'
import {
    EventBridgeClient,
    ListEventBusesCommand,
    CreateEventBusCommand,
    PutRuleCommand,
    PutTargetsCommand,
    PutEventsCommand,
} from '@aws-sdk/client-eventbridge'
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
const EventBridge = new EventBridgeClient(sharedConfig)
const Scheduler = new SchedulerClient(sharedConfig)
const ListEventBus = ListEventBusesCommand
const CreateEventBus = CreateEventBusCommand
const PutRule = PutRuleCommand
const PutTarget = PutTargetsCommand
const PutEvent = PutEventsCommand

export {
    s3,
    EventBridge,
    Scheduler,
    ListEventBus,
    CreateEventBus,
    PutRule,
    PutTarget,
    PutEvent,
}
