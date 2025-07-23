import httpStatus from 'http-status'
import { asyncHandler, ResponseHandler } from '../utils/index.js'
import { throwSpecificError } from '../middlewares/error.js'
import { organizationService } from '../services/index.js'

export default {
    create: asyncHandler(async (req, res) => {
        try {
            return ResponseHandler.success(req, res, {
                code: httpStatus.CREATED,
                messageCode: 'ORGANIZATION_S1',
                data: await organizationService.create(
                    ...req.body,
                ),
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_E1'
            )
        }
    }),

    list: asyncHandler(async (req, res) => {
        try {
            const data = await organizationService.list({
                user: req.user,
                ...req.pagination,
            })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'ORGANIZATION_S2',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_E3'
            )
        }
    }),

    details: asyncHandler(async (req, res) => {
        try {
            const data = await organizationService.details({
                id: req.params.id,
                user: req.user,
            })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'ORGANIZATION_S3',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_E5'
            )
        }
    }),

    update: asyncHandler(async (req, res) => {
        try {
            const data = await organizationService.update({
                body: req.body,
                id: req.params.id,
            })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'ORGANIZATION_S4',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_E8'
            )
        }
    }),

    delete: asyncHandler(async (req, res) => {
        try {
            const data = await organizationService.delete({
                id: req.params.id,
                user: req.user,
            })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'ORGANIZATION_S5',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_E10'
            )
        }
    }),
}