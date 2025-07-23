import { throwSpecificError } from '../middlewares/error.js'
import httpStatus from 'http-status'
import { AppError, consoleLog } from '../utils/index.js'
import {
    Organization,
} from '../../models/index.js'

export default {
    create: async (body) => {
        try {
            return await Organization.create(body)
        } catch (error) {
            consoleLog(error)
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_E2'
            )
        }
    },
    list: async ({ user, after, limit }) => {
        try {
            const paginationOptions = {
                where: {
                    isDeleted: false,
                },
                order: [['createdAt', 'DESC']],
                limit,
            }
            if (after) {
                paginationOptions.after = after
            }
            return await Organization.paginate(paginationOptions)
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_E4'
            )
        }
    },
    details: async ({ id, user }) => {
        try {
            const datum = await Organization.findOne({
                where: {
                    id,
                    isDeleted: false,
                },
            })
            if (!datum) throw new AppError(httpStatus.NOT_FOUND, 'ORGANIZATION_E7')

            return datum
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_E6'
            )
        }
    },
    update: async ({
                           id,
                           body
                       }) => {
        try {
            const [updated] = await Organization.update(
                {
                   ...body
                },
                {
                    where: {
                        id,
                    },
                }
            )
            if (updated === 0)
                throw new AppError(
                    httpStatus.NOT_FOUND,
                    'ORGANIZATION_E12'
                )
            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_E9'
            )
        }
    },
    delete: async ({ id, user }) => {
        try {
            const [updated] = await Organization.update(
                {
                    isDeleted: true,
                    isActive: false,
                },
                {
                    where: {
                        id,
                        isDeleted: false,
                    },
                }
            )
            if (updated === 0)
                throw new AppError(
                    httpStatus.NOT_FOUND,
                    'ORGANIZATION_E13'
                )
            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_E11'
            )
        }
    },
}