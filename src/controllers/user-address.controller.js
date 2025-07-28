import httpStatus from 'http-status'
import { asyncHandler, ResponseHandler } from '../utils/index.js'
import { throwSpecificError } from '../middlewares/index.js'
import { userAddressService } from '../services/index.js'

export default {
    userAddressCreate: asyncHandler(async (req, res) => {
        try {
            const data = await userAddressService.userAddressCreate({
                ...req.body,
                user: req.user,
            })

            return ResponseHandler.success(req, res, {
                code: httpStatus.CREATED,
                messageCode: 'USER_ADDRESS_S1',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'USER_ADDRESS_E1'
            )
        }
    }),

    userAddressList: asyncHandler(async (req, res) => {
        try {
            const data = await userAddressService.userAddressList({
                user: req.user,
            })

            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'USER_ADDRESS_S2',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'USER_ADDRESS_E3'
            )
        }
    }),

    userAddressDetails: asyncHandler(async (req, res) => {
        try {
            const data = await userAddressService.userAddressDetails({
                id: req.params.id,
                user: req.user,
            })

            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'USER_ADDRESS_S3',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'USER_ADDRESS_E5'
            )
        }
    }),

    userAddressUpdate: asyncHandler(async (req, res) => {
        try {
            const data = await userAddressService.userAddressUpdate({
                id: req.params.id,
                user: req.user,
                ...req.body,
            })

            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'USER_ADDRESS_S4',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'USER_ADDRESS_E7'
            )
        }
    }),

    userAddressDelete: asyncHandler(async (req, res) => {
        try {
            const data = await userAddressService.userAddressDelete({
                id: req.params.id,
                user: req.user,
            })

            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'USER_ADDRESS_S5',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'USER_ADDRESS_E9'
            )
        }
    }),
}
