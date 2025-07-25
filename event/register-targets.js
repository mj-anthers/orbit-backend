import 'dotenv/config'
import eventBridgeConfig from './config.js'
import { EventBridge } from '../config/aws.js'
import { consoleLog } from '../src/utils/index.js'

const registerTargets = async () => {
    for (const target of eventBridgeConfig.targets) {
        const { ruleName, targets } = target

        try {
            await EventBridge.putTargets({
                Rule: ruleName,
                EventBusName: process.env.EVENT_BUS_NAME,
                Targets: targets,
            }).promise()
            consoleLog(`✅ Targets attached to rule: ${ruleName}`)
        } catch (err) {
            consoleLog(
                `❌ Failed to attach targets for ${ruleName}:`,
                err.message
            )
        }
    }
}

registerTargets()
