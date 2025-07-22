import { asyncHandler, ResponseHandler } from '../utils/index.js'
import { throwSpecificError } from '../middlewares/error.js'
import httpStatus from 'http-status'
import { callBackService } from '../services/index.js'

export default {
    identitySSO: asyncHandler(async (req, res) => {
        try {
            const data = await callBackService.identitySSOLogin({
                ...req.body,
                ...req.query,
            })
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'CALLBACK_S1',
                data,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'CALLBACK_E1'
            )
        }
    }),
}
