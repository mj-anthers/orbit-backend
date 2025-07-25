import httpStatus from 'http-status'
import { asyncHandler, consoleLog, ResponseHandler } from '../utils/index.js'
import { throwSpecificError } from '../middlewares/error.js'
import { assetsService } from '../services/index.js'

export default {
    assetCreate: asyncHandler(async (req, res) => {
        try {
            return ResponseHandler.success(req, res, {
                code: httpStatus.CREATED,
                messageCode: 'ASSET_S1',
                data: await assetsService.assetCreate({
                    files: req.files,
                    organization: req.userOrganization.organization,
                    user: req.user,
                    name: req.body.name,
                }),
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ASSET_E1'
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
                messageCode: 'ASSET_S2',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ASSET_E3'
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
                messageCode: 'ASSET_S3',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ASSET_E5'
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
                messageCode: 'ASSET_S4',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ASSET_E8'
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
                messageCode: 'ASSET_S5',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ASSET_E10'
            )
        }
    }),
}
