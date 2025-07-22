import express from 'express'
import { callBackController } from '../controllers/index.js'

const router = express.Router()

router.get('/identity', callBackController.identitySSO)

export default router
