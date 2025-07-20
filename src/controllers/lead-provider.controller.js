import httpStatus from 'http-status'
import { asyncHandler, ResponseHandler } from '../utils/index.js'
import { throwSpecificError } from '../middlewares/error.js'
import { leadProviderService } from '../services/index.js'

export default {
    leadProviderCreate: asyncHandler(async (req, res) => {
        try {
            const data = await leadProviderService.leadProviderCreate({
                ...req.body,
                user: req.user,
                userOrganization: req.userOrganization,
                leadProviderUser: req.leadProviderUser,
                leadProviderProgram: req.leadProviderProgram,
            })
            return ResponseHandler.success(req, res, {
                code: httpStatus.CREATED,
                messageCode: 'LEAD_PROVIDER_S1',
                data: data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_E1'
            )
        }
    }),
    leadProviderList: asyncHandler(async (req, res) => {
        try {
            const data = await leadProviderService.leadProviderList({
                user: req.user,
                ...req.pagination,
            })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'LEAD_PROVIDER_S2',
                data: data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_E3'
            )
        }
    }),
    leadProviderDetails: asyncHandler(async (req, res) => {
        try {
            const data = await leadProviderService.leadProviderDetails(
                req.params.id
            )
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'LEAD_PROVIDER_S3',
                data: data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_E5'
            )
        }
    }),
    leadProviderUpdate: asyncHandler(async (req, res) => {
        try {
            const data = await leadProviderService.leadProviderUpdate({
                id: req.params.id,
                userOrganization: req.userOrganization,
            })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'LEAD_PROVIDER_S4',
                data: data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_E7'
            )
        }
    }),
    leadProviderDelete: asyncHandler(async (req, res) => {
        try {
            const data = await leadProviderService.leadProviderDelete(
                req.params.id
            )
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'LEAD_PROVIDER_S5',
                data: data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_E9'
            )
        }
    }),
    leadProviderToggleStatus: asyncHandler(async (req, res) => {
        try {
            const data = await leadProviderService.leadProviderToggleStatus(
                req.params.id
            )
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'LEAD_PROVIDER_S6',
                data: data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_E12'
            )
        }
    }),
}
