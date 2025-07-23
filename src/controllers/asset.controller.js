import httpStatus from 'http-status'
import { asyncHandler, ResponseHandler } from '../utils/index.js'
import { throwSpecificError } from '../middlewares/error.js'
import { assetsService } from '../services/index.js'

export default {
    assetCreate: asyncHandler(async (req, res) => {
        try {
            return ResponseHandler.success(req, res, {
                code: httpStatus.CREATED,
                messageCode: 'ASSETS_S1',
                data: await assetsService.assetCreate({
                    file: req.files,
                    organization: req.userOrganization.organization,
                    user: req.user,
                }),
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ASSETS_E1'
            )
        }
    }),

    assetList: asyncHandler(async (req, res) => {
        try {
            const data = await assetsService.assetList({
                user: req.user,
                ...req.pagination,
            })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'ASSETS_S2',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ASSETS_E3'
            )
        }
    }),

    assetDetails: asyncHandler(async (req, res) => {
        try {
            const data = await assetsService.assetDetails({
                id: req.params.id,
                user: req.user,
            })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'ASSETS_S3',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ASSETS_E5'
            )
        }
    }),

    assetUpdate: asyncHandler(async (req, res) => {
        try {
            const data = await assetsService.assetUpdate({
                body: req.body,
                id: req.params.id,
                user: req.user,
            })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'ASSETS_S4',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ASSETS_E8'
            )
        }
    }),

    assetDelete: asyncHandler(async (req, res) => {
        try {
            const data = await assetsService.assetDelete({
                id: req.params.id,
                user: req.user,
            })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'ASSETS_S5',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ASSETS_E10'
            )
        }
    }),
}
