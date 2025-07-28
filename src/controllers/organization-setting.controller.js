import { asyncHandler, ResponseHandler } from '../utils/index.js'
import { throwSpecificError } from '../middlewares/index.js'
import httpStatus from 'http-status'
import { organizationSettingService } from '../services/index.js'

export default {
    organizationSettingDetails: asyncHandler(async (req, res) => {
        try {
            const data =
                await organizationSettingService.organizationSettingDetails(
                    req.organization
                )
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'ORGANIZATION_SETTING_S1',
                data: data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_SETTING_E1'
            )
        }
    }),

    organizationSettingUpdate: asyncHandler(async (req, res) => {
        try {
            const data =
                await organizationSettingService.organizationSettingUpdate({
                    organization: req.organization,
                    body: req.body,
                })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'ORGANIZATION_SETTING_S2',
                data: data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_SETTING_E3'
            )
        }
    }),
}
