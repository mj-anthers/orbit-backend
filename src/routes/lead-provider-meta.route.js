import express from 'express'
import { leadProviderMetaController } from '../controllers/index.js'
import {
    commonValidate,
    leadProviderMetaValidate,
} from '../validators/index.js'

const router = express.Router()

router.put(
    '/:id',
    leadProviderMetaValidate.leadProviderMetaUpdateValidate,
    commonValidate.validateParamLeadProvider,
    leadProviderMetaController.leadProviderMetaUpdate
)

export default router
