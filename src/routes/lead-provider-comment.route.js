import express from 'express'
import {
    commonValidate,
    leadProviderCommentValidate,
} from '../validators/index.js'

import { leadProviderCommentController } from '../controllers/index.js'
import { defaultPagination } from '../middlewares/index.js'

const router = express.Router()

router.post(
    '/',
    leadProviderCommentValidate.leadProviderCommentCreateValidate,
    commonValidate.validatePostUserOrganization,
    commonValidate.validatePostLeadProvider,
    leadProviderCommentController.leadProviderCommentCreate
)

router.get(
    '/',
    defaultPagination,
    leadProviderCommentController.leadProviderCommentList
)

router.get(
    '/:id',
    leadProviderCommentValidate.leadProviderCommentIdValidate,
    leadProviderCommentController.leadProviderCommentDetails
)

router.put(
    '/:id',
    leadProviderCommentValidate.leadProviderCommentUpdateValidate,
    leadProviderCommentController.leadProviderCommentUpdate
)

router.delete(
    '/:id',
    leadProviderCommentValidate.leadProviderCommentIdValidate,
    leadProviderCommentController.leadProviderCommentDelete
)

export default router
