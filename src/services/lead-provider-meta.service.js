import { throwSpecificError } from '../middlewares/error.js'
import httpStatus from 'http-status'
import { LeadProviderMeta } from '../../models/index.js'

export default {
    leadProviderMetaUpdate: async ({ leadProvider, body }) => {
        try {
            await LeadProviderMeta.update(
                {
                    ...body,
                },
                {
                    leadProvider: leadProvider.id,
                }
            )
            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_META_E2',
                null
            )
        }
    },
}
