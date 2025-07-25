import 'dotenv/config'
import eventBridgeConfig from './config.js'
import { EventBridge } from '../config/aws.js'
import { consoleLog } from '../src/utils/index.js'

const registerRules = async () => {
    for (const rule of eventBridgeConfig.rules) {
        const { name, eventPattern, description } = rule

        await EventBridge.putRule({
            Name: name,
            EventBusName: process.env.EVENT_BUS_NAME,
            EventPattern: JSON.stringify(eventPattern),
            Description: description,
            State: 'ENABLED',
        }).promise()
        consoleLog(`✅ Rule created/updated: ${name}`)
    }
}

await registerRules()
