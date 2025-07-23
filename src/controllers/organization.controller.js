import httpStatus from 'http-status'
import { asyncHandler, ResponseHandler } from '../utils/index.js'
import { throwSpecificError } from '../middlewares/error.js'
import { organizationService } from '../services/index.js'

export default {
    organizationCreate: asyncHandler(async (req, res) => {
        try {
            return ResponseHandler.success(req, res, {
                code: httpStatus.CREATED,
                messageCode: 'ORGANIZATION_S1',
                data: await organizationService.organizationCreate({
                    user: req.user,
                    body: req.body,
                }),
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_E1'
            )
        }
    }),

    organizationList: asyncHandler(async (req, res) => {
        try {
            const data = await organizationService.organizationList({
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

    organizationDetails: asyncHandler(async (req, res) => {
        try {
            const data = await organizationService.organizationDetails({
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

    organizationUpdate: asyncHandler(async (req, res) => {
        try {
            const data = await organizationService.organizationUpdate({
                body: req.body,
                id: req.params.id,
                user: req.user,
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

    organizationDelete: asyncHandler(async (req, res) => {
        try {
            const data = await organizationService.organizationDelete({
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
