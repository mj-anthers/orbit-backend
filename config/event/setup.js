import 'dotenv/config'
import { consoleLog } from '../../src/utils/index.js'
import { EventBridge, ListEventBus, CreateEventBus } from '../aws/index.js'

const isValidString = (value) => {
    return typeof value === 'string' && value.trim().length > 0
}

const createAppBus = async () => {
    try {
        if (!isValidString(process.env.EVENT_BUS_NAME))
            throw new Error('Event bus name must be a valid string')

        const eventBusList = await EventBridge.send(
            new ListEventBus({
                NamePrefix: process.env.EVENT_BUS_NAME,
            })
        )

        const exists = eventBusList.EventBuses.some(
            (bus) => bus.Name === process.env.EVENT_BUS_NAME
        )
        if (exists)
            throw new Error(
                `Event buse with name "${process.env.EVENT_BUS_NAME}" already exists`
            )
        const params = {
            Name: process.env.EVENT_BUS_NAME,
            RoleArn: process.env.EVENT_BUS_ROLE,
        }
        const result = await EventBridge.send(new CreateEventBus(params))
        consoleLog(result)
    } catch (error) {
        consoleLog(error)
    }
}
createAppBus()
