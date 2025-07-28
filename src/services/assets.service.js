import { throwSpecificError } from '../middlewares/index.js'
import httpStatus from 'http-status'
import { AppError } from '../utils/index.js'
import { Asset } from '../../models/index.js'
import { Op } from 'sequelize'

export default {
    assetCreate: async ({ files, organization, user, name }) => {
        try {
            if (!files || files.length === 0) {
                throw new AppError(httpStatus.BAD_REQUEST, 'ASSET_E14')
            }

            return await Promise.all(
                files.map(async (file) => {
                    return await Asset.create({
                        name,
                        type: file.type,
                        url: `${process.env.S3_URL}/${file.name}`,
                        organization,
                        createdBy: user.id,
                    })
                })
            )
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ASSET_E2'
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
                'ASSET_E4'
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
            if (!datum) throw new AppError(httpStatus.NOT_FOUND, 'ASSET_E7')

            return datum
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ASSET_E6'
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
                throw new AppError(httpStatus.NOT_FOUND, 'ASSET_E12')
            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ASSET_E9'
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
                throw new AppError(httpStatus.NOT_FOUND, 'ASSET_E13')
            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ASSET_E11'
            )
        }
    },
}
