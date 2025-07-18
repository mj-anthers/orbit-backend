import { throwSpecificError } from '../middlewares/error.js'
import httpStatus from 'http-status'
import { AppError, consoleLog } from '../utils/index.js'
import {
    Lead,
    LEAD_STATUS_ENUM,
    LeadProvider,
    LeadProviderProgram,
    LeadProviderProgramCondition,
    User,
} from '../../models/index.js'
import { Op } from 'sequelize'
import RuleEngine from '../helpers/rule-engine/RuleEngine.js'

export default {
    leadCreate: async ({
        user,
        leadProvider,
        leadProviderProgram,
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
            return await Lead.create({
                leadProvider: leadProvider.id,
                leadProviderProgram: leadProviderProgram.id,
                customer: leadCustomer.id,
                organization: leadProviderProgram.organization,
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
                commissionPerInstall: leadProviderProgram.commissionPerInstall,
                commissionType: leadProviderProgram.commissionType,
                commissionValue: leadProviderProgram.commissionValue,
                commissionNeverExpire:
                    leadProviderProgram.commissionNeverExpire,
                commissionDuration: leadProviderProgram.commissionDuration,
                commissionBase: leadProviderProgram.commissionBase,
                uninstallationEvent: leadProviderProgram.uninstallationEvent,
                uninstallationDuration:
                    leadProviderProgram.uninstallationDuration,
                leadSource,
                createdBy: user.id,
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
    leadList: async ({ user, after, limit }) => {
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
    }) => {
        try {
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
            return true
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
