import { Op } from 'sequelize'
import httpStatus from 'http-status'
import { throwSpecificError } from '../middlewares/index.js'
import { AppError } from '../utils/index.js'
import {
    LeadProviderProgram,
    LeadProviderProgramCondition,
    sequelize,
} from '../../models/index.js'
import { LeadProviderProgramCommissionEvent } from '../../models/index.js'

export default {
    leadProviderProgramCreate: async ({
        title,
        baseRule,
        userOrganization,
        conditions,
        commissionNeverExpire,
        commissionDuration,
        commissionBase,
        leadProviderProgramRequiresApproval,
        uninstallationEvent,
        uninstallationDuration,
        commissionEvents,
    }) => {
        try {
            return await sequelize.transaction(async (transaction) => {
                const leadProviderProgramDatum =
                    await LeadProviderProgram.create(
                        {
                            title,
                            baseRule,
                            organization: userOrganization.organizationDatum.id,
                            commissionNeverExpire,
                            commissionDuration,
                            commissionBase,
                            leadProviderProgramRequiresApproval,
                            uninstallationEvent,
                            uninstallationDuration,
                        },
                        { transaction }
                    )

                const parsedConditions = conditions.map((condition) => {
                    return {
                        ...condition,
                        leadProviderProgram: leadProviderProgramDatum.id,
                        organization: userOrganization.organizationDatum.id,
                    }
                })

                const leadProviderProgramConditions =
                    await LeadProviderProgramCondition.bulkCreate(
                        parsedConditions,
                        { transaction }
                    )

                const parsedCommissions = commissionEvents.map((commission) => {
                    return {
                        leadProviderProgram: leadProviderProgramDatum.id,
                        organization: userOrganization.organizationDatum.id,
                        ...commission,
                    }
                })

                const leadProviderProgramCommissionEvents =
                    await LeadProviderProgramCommissionEvent.bulkCreate(
                        parsedCommissions,
                        { transaction }
                    )

                return {
                    ...leadProviderProgramDatum.dataValues,
                    conditions: leadProviderProgramConditions.map(
                        (condition) => {
                            return {
                                type: condition.type,
                                operator: condition.operator,
                                values: condition.values,
                            }
                        }
                    ),
                    commissionEvents: leadProviderProgramCommissionEvents.map(
                        (commissionEvent) => {
                            return {
                                type: commissionEvent.type,
                                amount: commissionEvent.amount,
                                commissionBasis:
                                    commissionEvent.commissionBasis,
                            }
                        }
                    ),
                }
            })
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
                        where: {
                            isDeleted: false,
                        },
                    },
                    {
                        model: LeadProviderProgramCommissionEvent,
                        as: 'commissionEvents',
                        attributes: ['type', 'amount', 'commissionBasis'],
                        where: {
                            isDeleted: false,
                        },
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
        user,
        title,
        baseRule,
        userOrganization,
        conditions,
        commissionNeverExpire,
        commissionDuration,
        commissionBase,
        leadProviderProgramRequiresApproval,
        uninstallationEvent,
        uninstallationDuration,
        commissionEvents,
    }) => {
        try {
            return await sequelize.transaction(async (transaction) => {
                // Step 1: Update main LeadProviderProgram
                const [updated] = await LeadProviderProgram.update(
                    {
                        title,
                        baseRule,
                        userOrganization,
                        conditions,
                        commissionNeverExpire,
                        commissionDuration,
                        commissionBase,
                        leadProviderProgramRequiresApproval,
                        uninstallationEvent,
                        uninstallationDuration,
                        commissionEvents,
                    },
                    {
                        where: {
                            id,
                            organization: {
                                [Op.in]: user.organizationIds,
                            },
                        },
                        transaction,
                    }
                )

                if (updated === 0) {
                    throw new AppError(
                        httpStatus.NOT_FOUND,
                        'LEAD_PROVIDER_PROGRAM_E14'
                    )
                }

                // Step 2: Mark old conditions as deleted
                await LeadProviderProgramCondition.update(
                    { isDeleted: true },
                    {
                        where: { leadProviderProgram: id },
                        transaction,
                    }
                )

                // Step 3: Create new conditions
                const parsedConditions = conditions.map((condition) => ({
                    ...condition,
                    leadProviderProgram: id,
                    organization: userOrganization.organizationDatum.id,
                }))

                await LeadProviderProgramCondition.bulkCreate(
                    parsedConditions,
                    {
                        transaction,
                    }
                )

                await LeadProviderProgramCommissionEvent.update(
                    { isDeleted: true },
                    {
                        where: { leadProviderProgram: id },
                        transaction,
                    }
                )

                // Step 4: Create new commission events
                const parsedCommissions = commissionEvents.map(
                    (commission) => ({
                        leadProviderProgram: id,
                        organization: userOrganization.organizationDatum.id,
                        ...commission,
                    })
                )

                await LeadProviderProgramCommissionEvent.bulkCreate(
                    parsedCommissions,
                    {
                        transaction,
                    }
                )

                return true
            })
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
