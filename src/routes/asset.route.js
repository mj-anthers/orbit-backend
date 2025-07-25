import express from 'express'
import { assetValidate, commonValidate } from '../validators/index.js'

import { assetController } from '../controllers/index.js'
import { defaultPagination, s3UploadMiddleware } from '../middlewares/index.js'

const router = express.Router()

router.post(
    '/',
    s3UploadMiddleware.uploadMultipleFiles,
    s3UploadMiddleware.uploadFilesToS3,
    assetValidate.assetsUploadValidate,
    commonValidate.validatePostUserOrganization,
    assetController.assetCreate
)

router.get('/', defaultPagination, assetController.assetList)

router.get('/:id', assetValidate.assetsIdValidate, assetController.assetDetails)

router.put(
    '/:id',
    assetValidate.assetsUpdateValidate,
    assetController.assetUpdate
)

router.delete(
    '/:id',
    assetValidate.assetsIdValidate,
    assetController.assetDelete
)

export default router
