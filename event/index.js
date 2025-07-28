import { consoleLog } from '../src/utils/index.js'
import { EventBridge, PutEvent } from '../config/aws/index.js'

export default {
    invokeEvent: async ({ type, data }) => {
        try {
            const command = new PutEvent({
                Entries: [
                    {
                        Source: process.env.APP_NAME,
                        DetailType: type,
                        Detail: JSON.stringify(data),
                        EventBusName: process.env.EVENT_BUS_NAME,
                        Time: new Date(),
                    },
                ],
            })
            const response = await EventBridge.send(command)
            consoleLog('Event sent:', JSON.stringify(response, null, 2))
            consoleLog('Event data:', JSON.stringify(data, null, 2))
        } catch (error) {
            consoleLog('Failed to send event:', error)
        }
    },
}
