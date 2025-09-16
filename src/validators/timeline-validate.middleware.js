import Joi from 'joi'
import commonValidate from './common-validate.middleware.js'

const idSchema = {
    params: Joi.object({
        id: commonValidate.validateUUID,
    }),
}

const idValidate = commonValidate.validate(idSchema)

export default {
    idValidate,
}
