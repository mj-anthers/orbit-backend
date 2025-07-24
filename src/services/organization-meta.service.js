import { throwSpecificError } from '../middlewares/error.js'
import httpStatus from 'http-status'
import { OrganizationMeta } from '../../models/index.js'

export default {
    organizationMetaUpdate: async ({ organization, body, user }) => {
        try {
            await OrganizationMeta.update(
                {
                    ...body,
                },
                {
                    organization,
                }
            )
            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_META_E2',
                null
            )
        }
    },
}
