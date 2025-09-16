import express from 'express'
import { commonValidate, timelineValidate } from '../validators/index.js'
import { timelineController } from '../controllers/index.js'

const router = express.Router()

router.get(
    '/lead-provider/:id',
    timelineValidate.idValidate,
    commonValidate.validateParamLeadProvider,
    timelineController.leadProviderTimeline
)

export default router
