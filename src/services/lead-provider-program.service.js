import { Op } from 'sequelize'
import httpStatus from 'http-status'
import { throwSpecificError } from '../middlewares/error.js'
import { AppError } from '../utils/index.js'
import {
    LeadProviderProgram,
    LeadProviderProgramCondition,
} from '../../models/index.js'

export default {
    leadProviderProgramCreate: async ({
        title,
        baseRule,
        userOrganization,
        conditions,
        commissionPerInstall,
        commissionType,
        commissionValue,
        commissionNeverExpire,
        commissionDuration,
        commissionBase,
        leadProviderProgramRequiresApproval,
        uninstallationEvent,
        uninstallationDuration,
    }) => {
        try {
            const leadProviderProgramDatum = await LeadProviderProgram.create({
                title,
                baseRule,
                organization: userOrganization.organizationDatum.id,
                commissionPerInstall,
                commissionType,
                commissionValue,
                commissionNeverExpire,
                commissionDuration,
                commissionBase,
                leadProviderProgramRequiresApproval,
                uninstallationEvent,
                uninstallationDuration,
            })

            const parsedConditions = conditions.map((condition) => {
                return {
                    ...condition,
                    leadProviderProgram: leadProviderProgramDatum.id,
                    organization: userOrganization.organizationDatum.id,
                }
            })

            const leadProviderProgramConditions =
                await LeadProviderProgramCondition.bulkCreate(parsedConditions)

            return {
                ...leadProviderProgramDatum.dataValues,
                conditions: leadProviderProgramConditions.map((condition) => {
                    return {
                        type: condition.type,
                        operator: condition.operator,
                        values: condition.values,
                    }
                }),
            }
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_PROGRAM_E2'
            )
        }
    },
    leadProviderProgramList: async ({ user, after, limit }) => {
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
            return await LeadProviderProgram.paginate(paginationOptions)
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_PROGRAM_E4'
            )
        }
    },
    leadProviderProgramDetails: async ({ id, user }) => {
        try {
            const datum = await LeadProviderProgram.findOne({
                where: {
                    id,
                    organization: {
                        [Op.in]: user.organizationIds,
                    },
                    isDeleted: false,
                },
                include: [
                    {
                        model: LeadProviderProgramCondition,
                        as: 'conditions',
                        attributes: ['type', 'operator', 'values'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            })
            if (!datum)
                throw new AppError(
                    httpStatus.NOT_FOUND,
                    'LEAD_PROVIDER_PROGRAM_E16'
                )
            return datum
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_PROGRAM_E6'
            )
        }
    },
    leadProviderProgramUpdate: async ({
        id,
        title,
        baseRule,
        user,
        userOrganization,
        conditions,
    }) => {
        try {
            const leadProviderProgramDatum = await LeadProviderProgram.findOne({
                where: {
                    id,
                    organization: {
                        [Op.in]: user.organizationIds,
                    },
                },
            })
            if (!leadProviderProgramDatum)
                throw new AppError(
                    httpStatus.NOT_FOUND,
                    'LEAD_PROVIDER_PROGRAM_E14'
                )
            leadProviderProgramDatum.title = title
            leadProviderProgramDatum.baseRule = baseRule
            leadProviderProgramDatum.organization =
                userOrganization.organizationDatum.id
            leadProviderProgramDatum.userOrganization = userOrganization.id
            await leadProviderProgramDatum.update()

            const parsedConditions = conditions.map((condition) => {
                return {
                    ...condition,
                    leadProviderProgram: id,
                    organization: userOrganization.organizationDatum.id,
                }
            })
            await LeadProviderProgramCondition.update(
                {
                    isDeleted: true,
                },
                {
                    where: {
                        leadProviderProgram: id,
                    },
                }
            )
            await LeadProviderProgramCondition.bulkCreate(parsedConditions)
            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_PROGRAM_E8'
            )
        }
    },
    leadProviderProgramDelete: async ({ id, user }) => {
        try {
            await LeadProviderProgram.update(
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
            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_PROGRAM_E10'
            )
        }
    },
    leadProviderProgramToggleStatus: async ({ id, user }) => {
        try {
            const datum = await LeadProviderProgram.findOne({
                where: {
                    id,
                    organization: {
                        [Op.in]: user.organizationIds,
                    },
                },
            })
            if (!datum)
                throw new AppError(
                    httpStatus.NOT_FOUND,
                    'LEAD_PROVIDER_PROGRAM_E15'
                )
            datum.isActive = !datum.isActive
            await datum.save()
            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_PROGRAM_E13'
            )
        }
    },
}
