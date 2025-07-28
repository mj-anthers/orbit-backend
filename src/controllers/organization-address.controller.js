import httpStatus from 'http-status'
import { asyncHandler, ResponseHandler } from '../utils/index.js'
import { throwSpecificError } from '../middlewares/index.js'
import { organizationAddressService } from '../services/index.js'

export default {
    organizationAddressCreate: asyncHandler(async (req, res) => {
        try {
            const data =
                await organizationAddressService.organizationAddressCreate({
                    ...req.body,
                    user: req.user,
                    organization: req.userOrganization.organization,
                })

            return ResponseHandler.success(req, res, {
                code: httpStatus.CREATED,
                messageCode: 'ORGANIZATION_ADDRESS_S1',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_ADDRESS_E1'
            )
        }
    }),

    organizationAddressList: asyncHandler(async (req, res) => {
        try {
            const data =
                await organizationAddressService.organizationAddressList({
                    user: req.user,
                })

            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'ORGANIZATION_ADDRESS_S2',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_ADDRESS_E3'
            )
        }
    }),

    organizationAddressDetails: asyncHandler(async (req, res) => {
        try {
            const data =
                await organizationAddressService.organizationAddressDetails({
                    id: req.params.id,
                    user: req.user,
                })

            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'ORGANIZATION_ADDRESS_S3',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_ADDRESS_E5'
            )
        }
    }),

    organizationAddressUpdate: asyncHandler(async (req, res) => {
        try {
            const data =
                await organizationAddressService.organizationAddressUpdate({
                    id: req.params.id,
                    user: req.user,
                    ...req.body,
                    organization: req.userOrganization.organization,
                })

            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'ORGANIZATION_ADDRESS_S4',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_ADDRESS_E7'
            )
        }
    }),

    organizationAddressDelete: asyncHandler(async (req, res) => {
        try {
            const data =
                await organizationAddressService.organizationAddressDelete({
                    id: req.params.id,
                    user: req.user,
                })

            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'ORGANIZATION_ADDRESS_S5',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_ADDRESS_E9'
            )
        }
    }),
}
