import httpStatus from 'http-status'
import { asyncHandler, ResponseHandler } from '../utils/index.js'
import { throwSpecificError } from '../middlewares/index.js'
import { timelineService } from '../services/index.js'

export default {
    leadProviderTimeline: asyncHandler(async (req, res) => {
        try {
            return ResponseHandler.success(req, res, {
                code: httpStatus.OK,
                messageCode: 'TIMELINE_S1',
                data: await timelineService.leadProviderTimeline(req.params),
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'TIMELINE_E1'
            )
        }
    }),
}
