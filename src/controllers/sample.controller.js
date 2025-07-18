import ResponseHandler from '../utils/response-handler.js'
import httpStatus from 'http-status'
import { asyncHandler } from '../utils/index.js'
import { throwSpecificError } from '../middlewares/error.js'

const sampleController = asyncHandler(async (req, res) => {
    try {
        const user = []
        ResponseHandler.success(req, res, {
            code: httpStatus.OK,
            messageCode: 'USER_S1',
            data: user,
        })
    } catch (error) {
        throwSpecificError(error, httpStatus.INTERNAL_SERVER_ERROR, 'USER_E2')
    }
})

export default sampleController
