import httpStatus from 'http-status'
import { asyncHandler, ResponseHandler } from '../utils/index.js'
import { leadProviderMetaService } from '../services/index.js'
import { throwSpecificError } from '../middlewares/error.js'

export default {
    leadProviderMetaUpdate: asyncHandler(async (req, res) => {
        try {
            const data = await leadProviderMetaService.leadProviderMetaUpdate({
                leadProvider: req.leadProvider,
                body: req.body,
                user: req.user,
            })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'LEAD_PROVIDER_META_S1',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'LEAD_PROVIDER_META_E1',
                null
            )
        }
    }),
}
