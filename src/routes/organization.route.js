import express from 'express'
import { organizationValidate } from '../validators/index.js'

import { organizationController } from '../controllers/index.js'
import { defaultPagination } from '../middlewares/index.js'

const router = express.Router()

router.post(
    '/',
    organizationValidate.organizationCreateValidate,
    organizationController.organizationCreate
)

router.get('/', defaultPagination, organizationController.organizationList)

router.get(
    '/:id',
    organizationValidate.organizationIdValidate,
    organizationController.organizationDetails
)

router.put(
    '/:id',
    organizationValidate.organizationUpdateValidate,
    organizationController.organizationUpdate
)

router.delete(
    '/:id',
    organizationValidate.organizationIdValidate,
    organizationController.organizationDelete
)

export default router
