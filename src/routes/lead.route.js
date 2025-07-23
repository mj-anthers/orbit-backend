import express from 'express'
import { leadValidate, commonValidate } from '../validators/index.js'

import { leadController } from '../controllers/index.js'
import { defaultPagination } from '../middlewares/index.js'

const router = express.Router()

router.post(
    '/',
    leadValidate.leadCreateValidate,
    leadValidate.leadCustomerValidate,
    leadValidate.leadSource,
    commonValidate.validatePostLeadProvider,
    leadController.leadCreate
)

router.get('/', defaultPagination, leadController.leadList)

router.get('/:id', leadValidate.leadIdValidate, leadController.leadDetails)

router.put('/:id', leadValidate.leadUpdateValidate, leadController.leadUpdate)

router.delete('/:id', leadValidate.leadIdValidate, leadController.leadDelete)

export default router
