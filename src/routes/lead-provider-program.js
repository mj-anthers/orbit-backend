import express from 'express'
import {
    leadProviderProgramValidate,
    commonValidate,
} from '../validators/index.js'

import { leadProviderProgramController } from '../controllers/index.js'
import { defaultPagination } from '../middlewares/index.js'

const router = express.Router()

router.post(
    '/',
    leadProviderProgramValidate.leadProviderProgramCreateValidate,
    commonValidate.validatePostUserOrganization,
    leadProviderProgramController.leadProviderProgramCreate
)
router.get(
    '/',
    defaultPagination,
    leadProviderProgramController.leadProviderProgramList
)

router.get(
    '/:id',
    leadProviderProgramValidate.leadProviderProgramIdValidate,
    leadProviderProgramController.leadProviderProgramDetails
)
router.put(
    '/:id',
    leadProviderProgramValidate.leadProviderProgramUpdateValidate,
    commonValidate.validatePostUserOrganization,
    leadProviderProgramController.leadProviderProgramUpdate
)
router.delete(
    '/:id',
    leadProviderProgramValidate.leadProviderProgramIdValidate,
    leadProviderProgramController.leadProviderProgramDelete
)
router.patch(
    '/:id',
    leadProviderProgramValidate.leadProviderProgramIdValidate,
    leadProviderProgramController.leadProviderProgramToggleStatus
)

export default router
