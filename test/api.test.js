import { expect } from 'chai'
import request from 'supertest'
import app from '../app.js'

describe('API Tests', () => {
    describe('GET /orbit/v1/health', () => {
        it('should return welcome message', async () => {
            const res = await request(app).get('/orbit/v1/health')
            expect(res.status).to.equal(200)
            expect(res.body.message).to.equal('API is working')
        })
    })
})
