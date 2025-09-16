import { throwSpecificError } from '../middlewares/error.js'
import httpStatus from 'http-status'
import { AppError, consoleLog, paginationFilter } from '../utils/index.js'
import { LeadProviderComment } from '../../models/index.js'
import { Op } from 'sequelize'

export default {
    leadProviderCommentCreate: async ({
        body,
        user,
        userOrganization,
        leadProvider,
    }) => {
        try {
            return await LeadProviderComment.create({
                ...body,
                organization: userOrganization.organizationDatum.id,
                leadProvider: leadProvider.id,
                createdBy: user.id,
            })
        } catch (error) {
            consoleLog(error)
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_COMMENT_E2'
            )
        }
    },
    leadProviderCommentList: async ({ user, after, query }) => {
        try {
            const { limit, ...otherQuery } = query
            const where = paginationFilter.parseSequelizeWhere(otherQuery)
            where['organization'] = {
                [Op.in]: user.organizationIds,
            }
            const paginationOptions = {
                where,
                order: [['createdAt', 'DESC']],
                limit,
            }
            if (after) {
                paginationOptions.after = after
            }
            return await LeadProviderComment.paginate(paginationOptions)
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_COMMENT_E4'
            )
        }
    },
    leadProviderCommentDetails: async ({ id, user }) => {
        try {
            const datum = await LeadProviderComment.findOne({
                where: {
                    id,
                    organization: {
                        [Op.in]: user.organizationIds,
                    },
                    isDeleted: false,
                },
            })
            if (!datum)
                throw new AppError(
                    httpStatus.NOT_FOUND,
                    'LEAD_PROVIDER_COMMENT_E7'
                )

            return datum
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_COMMENT_E6'
            )
        }
    },
    leadProviderCommentUpdate: async ({ id, body, user }) => {
        try {
            const [updated] = await LeadProviderComment.update(
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
                throw new AppError(
                    httpStatus.NOT_FOUND,
                    'LEAD_PROVIDER_COMMENT_E12'
                )
            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_COMMENT_E9'
            )
        }
    },
    leadProviderCommentDelete: async ({ id, user }) => {
        try {
            const [updated] = await LeadProviderComment.update(
                {
                    organization: {
                        [Op.in]: user.organizationIds,
                    },
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
                    'LEAD_PROVIDER_COMMENT_E13'
                )
            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_COMMENT_E11'
            )
        }
    },
}
