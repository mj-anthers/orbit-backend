import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { requestLogger, responseLogger, errorLogger } from 'axios-logger'
import { consoleLog } from '../../utils/index.js'

class NotificationClient {
    headers = {
        'Content-Type': 'application/json',
        'x-request-id': uuidv4(),
        'x-anthers-token': process.env.NOTIFICATION_TOKEN,
    }

    constructor() {
        this.client = axios.create({
            baseURL: process.env.NOTIFICATION_BASE_URL,
            timeout: 10000,
            headers: this.headers,
        })
        this.client.interceptors.request.use(requestLogger, errorLogger)
        this.client.interceptors.response.use(responseLogger, errorLogger)
    }

    sendEmail = async ({ email, content, subject }) => {
        try {
            const response = await this.client.post('/email', {
                from: {
                    name: process.env.NOTIFICATION_FROM_NAME,
                    email: process.env.NOTIFICATION_FROM_EMAIL,
                },
                to: [
                    {
                        email: email,
                        name: email,
                    },
                ],
                cc: [],
                bcc: [],
                subject,
                content,
                attachments: [],
            })
            return response.data
        } catch (error) {
            consoleLog(error)
            throw error
        }
    }
}

export default NotificationClient
