import httpStatus from 'http-status'
import { AppError, asyncHandler, ResponseHandler } from '../utils/index.js'
import { throwSpecificError } from '../middlewares/error.js'
import { notificationService } from '../services/index.js'
import { LeadProviderProgram } from '../../models/index.js'
import { Op } from 'sequelize'

export default {
    notificationCreate: asyncHandler(async (req, res) => {
        try {
            return ResponseHandler.success(req, res, {
                code: httpStatus.CREATED,
                messageCode: 'NOTIFICATION_S1',
                data: await notificationService.notificationCreate({
                    body: req.body,
                    organization: req.organization,
                }),
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'NOTIFICATION_E1'
            )
        }
    }),

    notificationList: asyncHandler(async (req, res) => {
        try {
            const data = await notificationService.notificationList({
                user: req.user,
                ...req.pagination,
            })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'NOTIFICATION_S2',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'NOTIFICATION_E3'
            )
        }
    }),

    notificationDetails: asyncHandler(async (req, res) => {
        try {
            const data = await notificationService.notificationDetails({
                id: req.params.id,
                user: req.user,
            })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'NOTIFICATION_S3',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'NOTIFICATION_E5'
            )
        }
    }),

    notificationUpdate: asyncHandler(async (req, res) => {
        try {
            const data = await notificationService.notificationUpdate({
                body: req.body,
                id: req.params.id,
                user: req.user,
            })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'NOTIFICATION_S4',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'NOTIFICATION_E8'
            )
        }
    }),

    notificationDelete: asyncHandler(async (req, res) => {
        try {
            const data = await notificationService.notificationDelete({
                id: req.params.id,
                user: req.user,
            })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'NOTIFICATION_S5',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'NOTIFICATION_E10'
            )
        }
    }),

    notificationToggleStatus: asyncHandler(async (req, res) => {
        try {
            const data = await notificationService.notificationToggleStatus({
                id: req.params.id,
                user: req.user,
            })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'NOTIFICATION_S6',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'NOTIFICATION_E14'
            )
        }
    }),
}
