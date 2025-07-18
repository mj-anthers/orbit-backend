import { expect } from 'chai'
import request from 'supertest'
import app from '../app.js'

describe('API Tests', () => {
    describe('GET /api', () => {
        it('should return welcome message', async () => {
            const res = await request(app).get('/api')
            expect(res.status).to.equal(200)
            expect(res.body.message).to.equal('API is working')
        })
    })

    describe('Rate Limiting', () => {
        it('should limit repeated requests', async () => {
            for (let i = 0; i < 101; i++) {
                const res = await request(app).get('/api')
                if (i === 100) {
                    expect(res.status).to.equal(429)
                }
            }
        })
    })
})
