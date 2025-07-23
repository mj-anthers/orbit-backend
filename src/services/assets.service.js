import { throwSpecificError } from '../middlewares/error.js'
import httpStatus from 'http-status'
import { AppError } from '../utils/index.js'
import { Asset } from '../../models/index.js'
import { Op } from 'sequelize'

export default {
    assetCreate: async ({ files, organization, user }) => {
        try {
            if (!files || files.length === 0) {
                throw new AppError(httpStatus.BAD_REQUEST, 'ASSET_E14')
            }
            return await Promise.all(
                files.map((file) =>
                    Asset.create({
                        name: file.originalname,
                        type: file.mimetype,
                        url: file.location,
                        organization,
                        createdBy: user.id, // if you have auth
                    })
                )
            )
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ASSETS_E2'
            )
        }
    },
    assetList: async ({ user, after, limit }) => {
        try {
            const paginationOptions = {
                where: {
                    isDeleted: false,
                },
                order: [['createdAt', 'DESC']],
                organization: {
                    [Op.in]: user.organizationIds,
                },
                limit,
            }
            if (after) {
                paginationOptions.after = after
            }
            return await Asset.paginate(paginationOptions)
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ASSETS_E4'
            )
        }
    },
    assetDetails: async ({ id, user }) => {
        try {
            const datum = await Asset.findOne({
                where: {
                    id,
                    isDeleted: false,
                    organization: {
                        [Op.in]: user.organizationIds,
                    },
                },
            })
            if (!datum) throw new AppError(httpStatus.NOT_FOUND, 'ASSETS_E7')

            return datum
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ASSETS_E6'
            )
        }
    },
    assetUpdate: async ({ id, body, user }) => {
        try {
            const [updated] = await Asset.update(
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
                throw new AppError(httpStatus.NOT_FOUND, 'ASSETS_E12')
            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ASSETS_E9'
            )
        }
    },
    assetDelete: async ({ id, user }) => {
        try {
            const [updated] = await Asset.update(
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
                throw new AppError(httpStatus.NOT_FOUND, 'ASSETS_E13')
            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ASSETS_E11'
            )
        }
    },
}
