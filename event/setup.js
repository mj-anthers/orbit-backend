import 'dotenv/config'
import { consoleLog } from '../src/utils/index.js'
import { EventBridge } from '../config/aws.js'

const isValidString = (value) => {
    return typeof value === 'string' && value.trim().length > 0
}

const createAppBus = async () => {
    try {
        if (!isValidString(process.env.EVENT_BUS_NAME))
            throw new Error('Event bus name must be a valid string')

        const eventBusList = await EventBridge.listEventBuses({
            NamePrefix: process.env.EVENT_BUS_NAME,
        }).promise()
        const exists = eventBusList.EventBuses.some(
            (bus) => bus.Name === process.env.EVENT_BUS_NAME
        )
        if (exists)
            throw new Error(
                `Event buse with name "${process.env.EVENT_BUS_NAME}" already exists`
            )
        const params = {
            Name: process.env.EVENT_BUS_NAME,
        }
        const result = await EventBridge.createEventBus(params).promise()
        consoleLog(result)
    } catch (error) {
        consoleLog(error)
    }
}
createAppBus()
