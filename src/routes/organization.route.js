import express from 'express'
import { organizationValidate } from '../validators/index.js'

import { organizationController } from '../controllers/index.js'
import { defaultPagination } from '../middlewares/index.js'

const router = express.Router()

router.post(
    '/',
    organizationValidate.organizationCreateValidate,
    organizationController.create
)

router.get('/', defaultPagination, organizationController.list)

router.get(
    '/:id',
    organizationValidate.organizationIdValidate,
    organizationController.details
)

router.put(
    '/:id',
    organizationValidate.organizationUpdateValidate,
    organizationController.update
)

router.delete(
    '/:id',
    organizationValidate.organizationIdValidate,
    organizationController.delete
)

export default router
