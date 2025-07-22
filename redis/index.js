import Redis from 'ioredis'
import { consoleLog } from '../src/utils/index.js'

class RedisClient {
    constructor() {
        if (!RedisClient.instance) {
            this.redis = new Redis({
                prefix: process.env.REDIS_IDENTIFIER,
                host: process.env.REDIS_HOST,
                password: process.env.REDIS_PASSWORD,
                port: process.env.REDIS_PORT,
            })

            this.redis.on('connect', () => consoleLog('✅ Redis connected'))
            this.redis.on('error', (err) => consoleLog('❌ Redis error:', err))

            RedisClient.instance = this
        }
    }

    async setUserSSOToken(key, value) {
        const args = [`SSO-TOKEN-${key}`, value]
        return this.redis.set(...args)
    }

    async getUserSSOToken(key) {
        try {
            return await this.redis.get(`SSO-TOKEN-${key}`)
        } catch (error) {
            consoleLog(error)
            return null
        }
    }
}

const redisInstance = new RedisClient()
export default redisInstance
