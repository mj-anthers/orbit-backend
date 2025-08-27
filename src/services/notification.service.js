import { throwSpecificError } from '../middlewares/error.js'
import httpStatus from 'http-status'
import { AppError, asyncHandler, consoleLog } from '../utils/index.js'
import { LeadProviderProgram, Notification } from '../../models/index.js'
import { Op } from 'sequelize'

export default {
    notificationCreate: async ({ body, organization }) => {
        try {
            let notification = await Notification.findOne({
                where: {
                    event: body.event,
                    organization: organization.id,
                    isDeleted: false,
                },
            })

            if (notification) {
                await notification.update({
                    ...body,
                    organization: organization.id,
                })
            } else {
                notification = await Notification.create({
                    ...body,
                    organization: organization.id,
                })
            }
            return notification
        } catch (error) {
            consoleLog(error)
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'NOTIFICATION_E2'
            )
        }
    },
    notificationList: async ({ user, after, limit }) => {
        try {
            const paginationOptions = {
                where: {
                    organization: {
                        [Op.in]: user.organizationIds,
                    },
                    isDeleted: false,
                },
                order: [['createdAt', 'DESC']],
                limit,
            }
            if (after) {
                paginationOptions.after = after
            }
            return await Notification.paginate(paginationOptions)
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'NOTIFICATION_E4'
            )
        }
    },
    notificationDetails: async ({ id, user }) => {
        try {
            const datum = await Notification.findOne({
                where: {
                    id,
                    organization: {
                        [Op.in]: user.organizationIds,
                    },
                    isDeleted: false,
                },
            })
            if (!datum)
                throw new AppError(httpStatus.NOT_FOUND, 'NOTIFICATION_E7')

            return datum
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'NOTIFICATION_E6'
            )
        }
    },
    notificationUpdate: async ({ id, body, user }) => {
        try {
            const [updated] = await Notification.update(
                {
                    ...body,
                },
                {
                    where: {
                        id,
                        organization: {
                            [Op.in]: user.organizationIds,
                        },
                    },
                }
            )
            if (updated === 0)
                throw new AppError(httpStatus.NOT_FOUND, 'NOTIFICATION_E12')
            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'NOTIFICATION_E9'
            )
        }
    },
    notificationDelete: async ({ id, user }) => {
        try {
            const [updated] = await Notification.update(
                {
                    isDeleted: true,
                    isActive: false,
                },
                {
                    where: {
                        id,
                        organization: {
                            [Op.in]: user.organizationIds,
                        },
                        isDeleted: false,
                    },
                }
            )
            if (updated === 0)
                throw new AppError(httpStatus.NOT_FOUND, 'NOTIFICATION_E13')
            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'NOTIFICATION_E11'
            )
        }
    },

    notificationToggleStatus: async ({ id, user }) => {
        try {
            const datum = await Notification.findOne({
                where: {
                    id,
                    organization: {
                        [Op.in]: user.organizationIds,
                    },
                    isDeleted: false,
                },
            })
            if (!datum)
                throw new AppError(httpStatus.NOT_FOUND, 'NOTIFICATION_E16')
            datum.isActive = !datum.isActive
            await datum.save()
            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'NOTIFICATION_E15'
            )
        }
    },
}
