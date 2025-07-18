import { consoleLog } from '../utils/index.js'
import {
    COMMISSION_TYPES,
    CREDIT_DEBIT_ENUM,
    Lead,
    LEAD_STATUS_ENUM,
    LeadProvider,
    LeadProviderProgram,
    LeadProviderProgramCondition,
} from '../../models/index.js'
import httpStatus from 'http-status'
import { AppError } from '../utils/index.js'
import { Commission } from '../../models/commission.model.js'

export default {
    disperseCommission: async ({ lead }) => {
        try {
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

            if (!leadDatum) throw new AppError(httpStatus.NOT_FOUND, 'LEAD_E12')

            consoleLog({
                level: 'info',
                leadDatum,
            })

            if (
                leadDatum &&
                leadDatum.leadProviderProgramDatum &&
                leadDatum.leadProviderProgramDatum.commissionPerInstall > 0
            ) {
                await Commission.create({
                    user: leadDatum.leadProviderDatum.user,
                    leadProvider: leadDatum.leadProviderDatum.id,
                    lead: leadDatum.id,
                    leadProviderProgram: leadDatum.leadProviderProgramDatum.id,
                    organization: leadDatum.organization,
                    amount: leadDatum.leadProviderProgramDatum
                        .commissionPerInstall,
                    commissionType: COMMISSION_TYPES.ONE_TIME,
                    creditOrDebit: CREDIT_DEBIT_ENUM.CREDIT,
                })
            }
        } catch (error) {
            consoleLog(error)
        }
    },
}
