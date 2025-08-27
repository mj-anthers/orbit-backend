import express from 'express'
import { commonValidate, notificationValidate } from '../validators/index.js'

import { notificationController } from '../controllers/index.js'
import { defaultPagination } from '../middlewares/index.js'

const router = express.Router()

router.post(
    '/',
    notificationValidate.notificationCreateValidate,
    commonValidate.validatePostOrganization,
    notificationController.notificationCreate
)

router.get('/', defaultPagination, notificationController.notificationList)

router.get(
    '/:id',
    notificationValidate.notificationIdValidate,
    notificationController.notificationDetails
)

router.put(
    '/:id',
    notificationValidate.notificationUpdateValidate,
    notificationController.notificationUpdate
)

router.delete(
    '/:id',
    notificationValidate.notificationIdValidate,
    notificationController.notificationDelete
)

router.patch(
    '/:id',
    notificationValidate.notificationIdValidate,
    notificationController.notificationToggleStatus
)

router.post(
    '/preview',
    notificationValidate.notificationPreviewValidate,
    notificationController.notificationPreview
)

export default router
