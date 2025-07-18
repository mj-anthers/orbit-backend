import express from 'express'
import {
    commonValidate,
    organizationAddressValidate,
} from '../validators/index.js'

import { organizationAddressController } from '../controllers/index.js'
import { defaultPagination } from '../middlewares/index.js'

const router = express.Router()

router.post(
    '/',
    organizationAddressValidate.organizationAddressCreateValidate,
    commonValidate.validatePostUserOrganization,
    organizationAddressController.organizationAddressCreate
)

router.get(
    '/',
    defaultPagination,
    organizationAddressController.organizationAddressList
)

router.get(
    '/:id',
    organizationAddressValidate.organizationAddressIdValidate,
    organizationAddressController.organizationAddressDetails
)

router.put(
    '/:id',
    organizationAddressValidate.organizationAddressIdValidate,
    commonValidate.validatePostUserOrganization,
    organizationAddressController.organizationAddressUpdate
)
router.delete(
    '/:id',
    organizationAddressValidate.organizationAddressIdValidate,
    organizationAddressController.organizationAddressDelete
)

export default router
