import axios from 'axios'
import crypto from 'crypto'
import { requestLogger, responseLogger, errorLogger } from 'axios-logger'

class IdentityClient {
    headers = {
        'Content-Type': 'application/json',
        'x-identity-token': process.env.IDENTITY_TOKEN,
    }

    constructor() {
        this.client = axios.create({
            baseURL: process.env.IDENTITY_BASE_URL,
            timeout: 10000,
            headers: this.headers,
        })
        this.client.interceptors.request.use(requestLogger, errorLogger)
        this.client.interceptors.response.use(responseLogger, errorLogger)
    }

    signUUID = (uuid) => {
        return crypto
            .createHmac('sha256', process.env.IDENTITY_SECRET)
            .update(uuid, 'utf8')
            .digest('hex')
    }

    ssoRedirectToken = async (email) => {
        const response = await this.client.post('/sso/link', {
            email,
            redirectUrl: process.env.IDENTITY_SSO_CALLBACK,
        })
        return response.data
    }

    userDetails = async (token) => {
        const response = await this.client.get('/user', {
            headers: {
                ...this.headers,
                'x-identity-user-token': this.signUUID(token),
            },
        })
        return response.data
    }
}

export default IdentityClient
