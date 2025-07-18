import { throwSpecificError } from '../middlewares/error.js'
import httpStatus from 'http-status'
import { OrganizationSetting } from '../../models/index.js'

export default {
    organizationSettingDetails: async (organization) => {
        try {
            return await OrganizationSetting.findOne({
                where: {
                    organization: organization.id,
                },
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_SETTING_E2'
            )
        }
    },
    organizationSettingUpdate: async ({ organization, body }) => {
        try {
            await OrganizationSetting.update(
                {
                    ...body,
                },
                {
                    where: {
                        organization: organization.id,
                    },
                }
            )
            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_SETTING_E4'
            )
        }
    },
}
