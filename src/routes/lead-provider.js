import express from 'express'
import { leadProviderValidate, commonValidate } from '../validators/index.js'

import { leadProviderController } from '../controllers/index.js'
import { defaultPagination } from '../middlewares/index.js'

const router = express.Router()

router.post(
    '/',
    leadProviderValidate.leadProviderCreateValidate,
    commonValidate.validatePostUserOrganization,
    commonValidate.validatePostLeadProviderProgram,
    leadProviderValidate.leadProviderUserValidate,
    leadProviderController.leadProviderCreate
)
router.get('/', defaultPagination, leadProviderController.leadProviderList)

router.get(
    '/:id',
    leadProviderValidate.leadProviderIdValidate,
    leadProviderController.leadProviderDetails
)

router.get(
    '/:id/metrics',
    leadProviderValidate.leadProviderIdValidate,
    leadProviderController.leadProviderMetrics
)

router.put(
    '/:id',
    leadProviderValidate.leadProviderUpdateValidate,
    commonValidate.validatePostUserOrganization,
    leadProviderController.leadProviderUpdate
)
router.delete(
    '/:id',
    leadProviderValidate.leadProviderIdValidate,
    leadProviderController.leadProviderDelete
)
router.patch(
    '/:id',
    leadProviderValidate.leadProviderIdValidate,
    leadProviderController.leadProviderToggleStatus
)

router.patch(
    '/:id/change-program',
    leadProviderValidate.leadProviderIdValidate,
    commonValidate.validatePostLeadProviderProgram,
    leadProviderController.leadProviderChangeLeadProviderProgram
)

export default router
