import { throwSpecificError } from '../middlewares/error.js'
import httpStatus from 'http-status'
import { AppError, consoleLog } from '../utils/index.js'
import {
    LeadProvider,
    LeadProviderProgram,
    Organization,
    User,
    UserOrganization,
} from '../../models/index.js'

export default {
    leadProviderCreate: async ({
        user,
        userOrganization,
        leadProviderUser,
        leadProviderProgram,
    }) => {
        try {
            const [record, created] = await LeadProvider.findOrCreate({
                where: {
                    user: leadProviderUser.id,
                    organization: userOrganization.organizationDatum.id,
                    userOrganization: userOrganization.id,
                    leadProviderProgram: leadProviderProgram.id,
                },
                defaults: {
                    user: leadProviderUser.id,
                    organization: userOrganization.organizationDatum.id,
                    userOrganization: userOrganization.id,
                    leadProviderProgram: leadProviderProgram.id,
                    createdBy: user.id,
                    isActive: true,
                },
            })
            if (!created)
                throw new AppError(httpStatus.CONFLICT, 'LEAD_PROVIDER_E11')
            return record.dataValues
        } catch (error) {
            consoleLog(error)
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_E2'
            )
        }
    },
    leadProviderList: async ({ user, after, limit }) => {
        try {
            const paginationOptions = {
                where: {
                    createdBy: user.id,
                    isDeleted: false,
                },
                order: [['createdAt', 'DESC']],
                limit,
                include: [
                    {
                        model: User,
                        as: 'userLeadProviderDatum',
                        attributes: ['id', 'email', 'firstName', 'lastName'],
                    },
                    {
                        model: User,
                        as: 'userCreatedByDatum',
                        attributes: ['id', 'email', 'firstName', 'lastName'],
                    },
                    {
                        model: UserOrganization,
                        as: 'userOrganizationDatum',
                        include: [
                            {
                                model: Organization,
                                as: 'organizationDatum',
                                attributes: ['id', 'name'],
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
            return await LeadProvider.paginate(paginationOptions)
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_E4'
            )
        }
    },
    leadProviderDetails: async (id) => {
        try {
            const leadProviderDatum = await LeadProvider.findOne({
                where: {
                    id,
                    isDeleted: false,
                },
                include: [
                    {
                        model: User,
                        as: 'userLeadProviderDatum',
                        attributes: ['id', 'email', 'firstName', 'lastName'],
                    },
                    {
                        model: User,
                        as: 'userCreatedByDatum',
                        attributes: ['id', 'email', 'firstName', 'lastName'],
                    },
                    {
                        model: UserOrganization,
                        as: 'userOrganizationDatum',
                        include: [
                            {
                                model: Organization,
                                as: 'organizationDatum',
                                attributes: ['id', 'name'],
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
            if (!leadProviderDatum)
                throw new AppError(httpStatus.NOT_FOUND, 'LEAD_PROVIDER_E15')

            return leadProviderDatum
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_E6'
            )
        }
    },
    leadProviderUpdate: async ({ id, userOrganization }) => {
        try {
            await LeadProvider.update(
                {
                    organization: userOrganization.organizationDatum.id,
                    userOrganization: userOrganization.id,
                },
                {
                    where: {
                        id,
                    },
                }
            )
            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_E8'
            )
        }
    },
    leadProviderDelete: async (id) => {
        try {
            await LeadProvider.update(
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
            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_E10'
            )
        }
    },
    leadProviderToggleStatus: async (id) => {
        try {
            const datum = await LeadProvider.findOne({
                where: {
                    id,
                    isDeleted: false,
                },
            })
            if (!datum)
                throw new AppError(httpStatus.NOT_FOUND, 'LEAD_PROVIDER_E14')
            datum.isActive = !datum.isActive
            await datum.save()
            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_E13'
            )
        }
    },
}
