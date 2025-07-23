import httpStatus from 'http-status'
import { throwSpecificError } from '../middlewares/error.js'
import { AppError } from '../utils/index.js'
import {
    Organization,
    UserOrganization,
    USER_ORGANIZATION_USER_TYPES,
    sequelize,
} from '../../models/index.js'

export default {
    organizationCreate: async ({ user, body }) => {
        try {
            return await sequelize.transaction(async (transaction) => {
                const organizationDatum = await Organization.create(
                    {
                        ...body,
                        user: user.id,
                    },
                    {
                        transaction,
                    }
                )
                await UserOrganization.create(
                    {
                        organization: organizationDatum.id,
                        user: user.id,
                        userType: USER_ORGANIZATION_USER_TYPES.OWNER,
                    },
                    {
                        transaction,
                    }
                )
                return {
                    id: organizationDatum.id,
                    name: organizationDatum.name,
                }
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_E2'
            )
        }
    },
    organizationList: async ({ user, after, limit }) => {
        try {
            const paginationOptions = {
                where: {
                    user: user.id,
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
    organizationDetails: async ({ id, user }) => {
        try {
            const datum = await Organization.findOne({
                where: {
                    id,
                    user: user.id,
                    isDeleted: false,
                },
            })
            if (!datum)
                throw new AppError(httpStatus.NOT_FOUND, 'ORGANIZATION_E7')

            return datum
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_E6'
            )
        }
    },
    organizationUpdate: async ({ id, body, user }) => {
        try {
            const [updated] = await Organization.update(
                {
                    ...body,
                },
                {
                    where: {
                        id,
                        user: user.id,
                        isDeleted: false,
                    },
                }
            )
            if (updated === 0)
                throw new AppError(httpStatus.NOT_FOUND, 'ORGANIZATION_E12')
            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_E9'
            )
        }
    },
    organizationDelete: async ({ id, user }) => {
        try {
            const [updated] = await Organization.update(
                {
                    isDeleted: true,
                    isActive: false,
                },
                {
                    where: {
                        id,
                        user: user.id,
                        isDeleted: false,
                    },
                }
            )
            if (updated === 0)
                throw new AppError(httpStatus.NOT_FOUND, 'ORGANIZATION_E13')
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
