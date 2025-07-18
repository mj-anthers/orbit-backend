import httpStatus from 'http-status'
import { asyncHandler, ResponseHandler } from '../utils/index.js'
import { throwSpecificError } from '../middlewares/error.js'
import { leadService } from '../services/index.js'

export default {
    leadCreate: asyncHandler(async (req, res) => {
        try {
            return ResponseHandler.success(req, res, {
                code: httpStatus.CREATED,
                messageCode: 'LEAD_S1',
                data: await leadService.leadCreate({
                    ...req.body,
                    leadSource: req.leadSource,
                    user: req.user,
                    leadProviderProgram: req.leadProviderProgram,
                    leadProvider: req.leadProvider,
                    leadCustomer: req.leadCustomer,
                }),
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_E1'
            )
        }
    }),

    leadList: asyncHandler(async (req, res) => {
        try {
            const data = await leadService.leadList({
                user: req.user,
                ...req.pagination,
            })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'LEAD_S2',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_E2'
            )
        }
    }),

    leadDetails: asyncHandler(async (req, res) => {
        try {
            const data = await leadService.leadDetails({
                id: req.params.id,
                user: req.user,
            })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'LEAD_S3',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_E3'
            )
        }
    }),

    leadUpdate: asyncHandler(async (req, res) => {
        try {
            const data = await leadService.leadUpdate({
                ...req.body,
                id: req.params.id,
                user: req.user,
                userOrganization: req.userOrganization,
            })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'LEAD_S4',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_E4'
            )
        }
    }),

    leadDelete: asyncHandler(async (req, res) => {
        try {
            const data = await leadService.leadDelete({
                id: req.params.id,
                user: req.user,
            })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'LEAD_S5',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_E5'
            )
        }
    }),
}
