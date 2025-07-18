import express from 'express'
import { organizationSettingController } from '../controllers/index.js'
import {
    commonValidate,
    organizationSettingValidate,
} from '../validators/index.js'

const router = express.Router()

// Public routes (no authentication required)
router.get(
    '/:id',
    organizationSettingValidate.organizationIdValidate,
    commonValidate.validateParamOrganization,
    organizationSettingController.organizationSettingDetails
)
router.put(
    '/:id',
    organizationSettingValidate.organizationUpdateValidate,
    commonValidate.validateParamOrganization,
    organizationSettingController.organizationSettingUpdate
)

export default router
