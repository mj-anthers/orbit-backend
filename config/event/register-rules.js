import 'dotenv/config'
import eventBridgeConfig from '../../config/event/config.js'
import { EventBridge, PutRule } from '../aws/index.js'
import { consoleLog } from '../../src/utils/index.js'

const registerRules = async () => {
    for (const rule of eventBridgeConfig.rules) {
        const { name, eventPattern, description } = rule

        await EventBridge.send(
            new PutRule({
                Name: name,
                EventBusName: process.env.EVENT_BUS_NAME,
                EventPattern: JSON.stringify(eventPattern),
                Description: description,
                State: 'ENABLED',
            })
        )
        consoleLog(`✅ Rule created/updated: ${name}`)
    }
}

await registerRules()
