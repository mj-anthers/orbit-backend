import { throwSpecificError } from '../middlewares/index.js'
import httpStatus from 'http-status'
import { AppError, consoleLog, paginationFilter } from '../utils/index.js'
import {
    Lead,
    LEAD_STATUS_ENUM,
    LeadCommissionEvent,
    LeadProvider,
    LeadProviderProgram,
    LeadProviderProgramCommissionEvent,
    LeadProviderProgramCondition,
    User,
    sequelize,
} from '../../models/index.js'
import { Op } from 'sequelize'
import RuleEngine from '../helpers/rule-engine/RuleEngine.js'

export default {
    leadCreate: async ({
        user,
        leadProvider,
        leadCustomer,
        effectiveDate,
        notes,
        installStatus,
        installDate,
        country,
        platformPlanName,
        platformPlanPrice,
        appPlanName,
        appPlanPrice,
        leadSource,
    }) => {
        try {
            return await sequelize.transaction(async (transaction) => {
                const leadProviderProgramDatum =
                    await LeadProviderProgram.findOne({
                        where: {
                            id: leadProvider.leadProviderProgram,
                        },
                        include: [
                            {
                                model: LeadProviderProgramCommissionEvent,
                                as: 'commissionEvents',
                                attributes: [
                                    'type',
                                    'amount',
                                    'commissionBasis',
                                ],
                                where: {
                                    isDeleted: false,
                                },
                            },
                        ],
                    })

                if (!leadProviderProgramDatum)
                    throw new AppError(
                        httpStatus.PRECONDITION_FAILED,
                        'LEAD_E13'
                    )

                const leadDatum = await Lead.create(
                    {
                        leadProvider: leadProvider.id,
                        leadProviderProgram: leadProvider.leadProviderProgram,
                        customer: leadCustomer.id,
                        organization: leadProvider.organization,
                        user: leadProvider.userLeadProviderDatum.id,
                        effectiveDate,
                        notes,
                        installStatus,
                        installDate,
                        country,
                        platformPlanName,
                        platformPlanPrice,
                        appPlanName,
                        appPlanPrice,
                        commissionNeverExpire:
                            leadProviderProgramDatum.commissionNeverExpire,
                        commissionDuration:
                            leadProviderProgramDatum.commissionDuration,
                        commissionBase: leadProviderProgramDatum.commissionBase,
                        uninstallationEvent:
                            leadProviderProgramDatum.uninstallationEvent,
                        uninstallationDuration:
                            leadProviderProgramDatum.uninstallationDuration,
                        leadSource,
                        createdBy: user.id,
                    },
                    { transaction }
                )

                const parsedLeadCommissionEvents =
                    leadProviderProgramDatum.commissionEvents.map(
                        (commissionEvent) => {
                            consoleLog({ commissionEvent })
                            return {
                                lead: leadDatum.id,
                                organization: leadProvider.organization,
                                type: commissionEvent.type,
                                amount: commissionEvent.amount,
                                commissionBasis:
                                    commissionEvent.commissionBasis,
                            }
                        }
                    )

                await LeadCommissionEvent.bulkCreate(
                    parsedLeadCommissionEvents,
                    { transaction }
                )

                return {
                    ...leadDatum.dataValues,
                    commissionEvents: parsedLeadCommissionEvents.map(
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
            consoleLog(error)
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_E6'
            )
        }
    },
    leadList: async ({ user, after, limit, query }) => {
        try {
            const where = paginationFilter.parseSequelizeWhere(query)
            where['organization'] = {
                [Op.in]: user.organizationIds,
            }

            const paginationOptions = {
                where,
                order: [['createdAt', 'DESC']],
                limit,
                include: [
                    {
                        model: LeadProvider,
                        as: 'leadProviderDatum',
                        attributes: ['id'],
                        include: [
                            {
                                model: User,
                                as: 'userLeadProviderDatum',
                                attributes: ['id', 'firstName', 'lastName'],
                            },
                        ],
                    },
                    {
                        model: LeadProviderProgram,
                        as: 'leadProviderProgramDatum',
                        attributes: ['id', 'title'],
                    },
                ],
            }
            if (after) {
                paginationOptions.after = after
            }
            return await Lead.paginate(paginationOptions)
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_E7'
            )
        }
    },
    leadDetails: async ({ id, user }) => {
        try {
            const leadDatum = await Lead.findOne({
                where: {
                    id,
                    organization: {
                        [Op.in]: user.organizationIds,
                    },
                    isDeleted: false,
                },
                include: [
                    {
                        model: LeadProvider,
                        as: 'leadProviderDatum',
                        attributes: ['id'],
                        include: [
                            {
                                model: User,
                                as: 'userLeadProviderDatum',
                                attributes: ['id', 'firstName', 'lastName'],
                            },
                        ],
                    },
                    {
                        model: LeadProviderProgram,
                        as: 'leadProviderProgramDatum',
                        attributes: ['id', 'title'],
                    },
                    {
                        model: LeadCommissionEvent,
                        as: 'commissionEvents',
                        attributes: ['title', 'amount', 'commissionBasis'],
                    },
                ],
            })
            if (!leadDatum) throw new AppError(httpStatus.NOT_FOUND, 'LEAD_E8')

            return leadDatum
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_E9'
            )
        }
    },
    leadUpdate: async ({
        id,
        effectiveDate,
        status,
        note,
        user,
        notes,
        installStatus,
        installDate,
        country,
        platformPlanName,
        platformPlanPrice,
        appPlanName,
        appPlanPrice,
        commissionEvents,
    }) => {
        try {
            return await sequelize.transaction(async (transaction) => {
                const leadDatum = await Lead.findOne({
                    where: {
                        id,
                        organization: {
                            [Op.in]: user.organizationIds,
                        },
                    },
                })
                if (!leadDatum)
                    throw new AppError(
                        httpStatus.PRECONDITION_FAILED,
                        'LEAD_E14'
                    )
                await Lead.update(
                    {
                        effectiveDate,
                        note,
                        status,
                        notes,
                        installStatus,
                        installDate,
                        country,
                        platformPlanName,
                        platformPlanPrice,
                        appPlanName,
                        appPlanPrice,
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

                await LeadCommissionEvent.update(
                    { isDeleted: true },
                    {
                        where: { lead: id },
                        transaction,
                    }
                )

                const parsedCommissionEvents = commissionEvents.map(
                    (condition) => ({
                        ...condition,
                        lead: leadDatum.id,
                        organization: leadDatum.organization,
                    })
                )

                await LeadCommissionEvent.bulkCreate(parsedCommissionEvents, {
                    transaction,
                })

                return true
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_E10'
            )
        }
    },
    leadDelete: async ({ id, user }) => {
        try {
            await Lead.update(
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
                'LEAD_E11'
            )
        }
    },

    assignLeadProviderRuleToLead: async ({ lead }) => {
        try {
            const context = {
                qty: [6],
            }
            const leadDatum = await Lead.findOne({
                where: {
                    id: lead,
                    status: LEAD_STATUS_ENUM.APPROVED,
                },
                include: [
                    {
                        model: LeadProvider,
                        as: 'leadProviderDatum',
                    },
                    {
                        model: LeadProviderProgram,
                        as: 'leadProviderProgramDatum',
                        include: [
                            {
                                model: LeadProviderProgramCondition,
                                as: 'conditions',
                                attributes: ['type', 'operator', 'values'],
                            },
                        ],
                    },
                ],
            })
            const multiEngine = new RuleEngine(
                leadDatum.leadProviderProgramDatum
            )
            const matchedRule = multiEngine.evaluate(context)

            return matchedRule
        } catch (error) {
            consoleLog(error)
        }
    },
}
