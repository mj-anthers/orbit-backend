import httpStatus from 'http-status'
import { asyncHandler, ResponseHandler } from '../utils/index.js'
import { throwSpecificError } from '../middlewares/error.js'
import { leadProviderProgramService } from '../services/index.js'

export default {
    leadProviderProgramCreate: asyncHandler(async (req, res) => {
        try {
            const data =
                await leadProviderProgramService.leadProviderProgramCreate({
                    ...req.body,
                    userOrganization: req.userOrganization,
                })
            return ResponseHandler.success(req, res, {
                code: httpStatus.CREATED,
                messageCode: 'LEAD_PROVIDER_PROGRAM_S1',
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
    leadProviderProgramList: asyncHandler(async (req, res) => {
        try {
            const data =
                await leadProviderProgramService.leadProviderProgramList({
                    user: req.user,
                    ...req.pagination,
                })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'LEAD_PROVIDER_PROGRAM__S2',
                data: data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_PROGRAM_E3'
            )
        }
    }),
    leadProviderProgramDetails: asyncHandler(async (req, res) => {
        try {
            const data =
                await leadProviderProgramService.leadProviderProgramDetails({
                    id: req.params.id,
                    user: req.user,
                })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'LEAD_PROVIDER_PROGRAM_S3',
                data: data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_PROGRAM_E5'
            )
        }
    }),
    leadProviderProgramUpdate: asyncHandler(async (req, res) => {
        try {
            const data =
                await leadProviderProgramService.leadProviderProgramUpdate({
                    id: req.params.id,
                    user: req.user,
                    ...req.body,
                    userOrganization: req.userOrganization,
                })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'LEAD_PROVIDER_PROGRAM_S4',
                data: data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_PROGRAM_E7'
            )
        }
    }),
    leadProviderProgramDelete: asyncHandler(async (req, res) => {
        try {
            const data =
                await leadProviderProgramService.leadProviderProgramDelete({
                    id: req.params.id,
                    user: req.user,
                })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'LEAD_PROVIDER_PROGRAM_S5',
                data: data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_PROGRAM_E9'
            )
        }
    }),
    leadProviderProgramToggleStatus: asyncHandler(async (req, res) => {
        try {
            const data =
                await leadProviderProgramService.leadProviderProgramToggleStatus(
                    {
                        id: req.params.id,
                        user: req.user,
                    }
                )
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'LEAD_PROVIDER_PROGRAM_S6',
                data: data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_PROGRAM_E12'
            )
        }
    }),
}
