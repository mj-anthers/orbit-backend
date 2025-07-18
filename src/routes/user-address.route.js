import express from 'express'
import { commonValidate, userAddressValidate } from '../validators/index.js'

import { userAddressController } from '../controllers/index.js'
import { defaultPagination } from '../middlewares/index.js'

const router = express.Router()

router.post(
    '/',
    userAddressValidate.userAddressCreateValidate,
    userAddressController.userAddressCreate
)

router.get('/', defaultPagination, userAddressController.userAddressList)

router.get(
    '/:id',
    userAddressValidate.userAddressIdValidate,
    userAddressController.userAddressDetails
)

router.put(
    '/:id',
    userAddressValidate.userAddressUpdateValidate,
    userAddressController.userAddressUpdate
)

router.delete(
    '/:id',
    userAddressValidate.userAddressIdValidate,
    userAddressController.userAddressDelete
)

export default router
