import { consoleLog } from '../src/utils/index.js'
import { snsClient, snsPublish } from '../config/aws/index.js'

export default {
    invokeEvent: async ({ source, data }) => {
        try {
            const command = new snsPublish({
                TopicArn: process.env.SNS_TOPIC,
                Message: JSON.stringify(data),
                MessageAttributes: {
                    source: {
                        DataType: 'String',
                        StringValue: source,
                    },
                },
            })
            const response = await snsClient.send(command)
            consoleLog('Event sent:', JSON.stringify(response, null, 2))
            consoleLog('Event data:', JSON.stringify(data, null, 2))
        } catch (error) {
            consoleLog('Failed to send event: ', error)
        }
    },
}
