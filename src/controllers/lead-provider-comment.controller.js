import httpStatus from 'http-status'
import { asyncHandler, ResponseHandler } from '../utils/index.js'
import { throwSpecificError } from '../middlewares/error.js'
import { leadProviderCommentService } from '../services/index.js'

export default {
    leadProviderCommentCreate: asyncHandler(async (req, res) => {
        try {
            return ResponseHandler.success(req, res, {
                code: httpStatus.CREATED,
                messageCode: 'LEAD_PROVIDER_COMMENT_S1',
                data: await leadProviderCommentService.leadProviderCommentCreate(
                    {
                        body: req.body,
                        user: req.user,
                        userOrganization: req.userOrganization,
                        leadProvider: req.leadProvider,
                    }
                ),
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_COMMENT_E1'
            )
        }
    }),

    leadProviderCommentList: asyncHandler(async (req, res) => {
        try {
            const data =
                await leadProviderCommentService.leadProviderCommentList({
                    user: req.user,
                    query: req.query,
                    ...req.pagination,
                })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'LEAD_PROVIDER_COMMENT_S2',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_COMMENT_E3'
            )
        }
    }),

    leadProviderCommentDetails: asyncHandler(async (req, res) => {
        try {
            const data =
                await leadProviderCommentService.leadProviderCommentDetails({
                    id: req.params.id,
                    user: req.user,
                })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'LEAD_PROVIDER_COMMENT_S3',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_COMMENT_E5'
            )
        }
    }),

    leadProviderCommentUpdate: asyncHandler(async (req, res) => {
        try {
            const data =
                await leadProviderCommentService.leadProviderCommentUpdate({
                    body: req.body,
                    id: req.params.id,
                    user: req.user,
                })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'LEAD_PROVIDER_COMMENT_S4',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_COMMENT_E8'
            )
        }
    }),

    leadProviderCommentDelete: asyncHandler(async (req, res) => {
        try {
            const data =
                await leadProviderCommentService.leadProviderCommentDelete({
                    id: req.params.id,
                    user: req.user,
                })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'LEAD_PROVIDER_COMMENT_S5',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_COMMENT_E10'
            )
        }
    }),
}
