import express from 'express'
import { organizationMetaController } from '../controllers/index.js'
import {
    commonValidate,
    organizationMetaValidate,
} from '../validators/index.js'

const router = express.Router()

router.put(
    '/:id',
    organizationMetaValidate.organizationMetaUpdateValidate,
    commonValidate.validateParamUserOrganization,
    organizationMetaController.organizationMetaUpdate
)

export default router
