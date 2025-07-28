import httpStatus from 'http-status'
import { asyncHandler, ResponseHandler } from '../utils/index.js'
import { organizationMetaService } from '../services/index.js'
import { throwSpecificError } from '../middlewares/index.js'

export default {
    organizationMetaUpdate: asyncHandler(async (req, res) => {
        try {
            const data = await organizationMetaService.organizationMetaUpdate({
                organization: req.userOrganization.organization,
                body: req.body,
                user: req.user,
            })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'ORGANIZATION_META_S1',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_META_E1',
                null
            )
        }
    }),
}
