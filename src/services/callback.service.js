import httpStatus from 'http-status'
import { throwSpecificError } from '../middlewares/index.js'
import Identity from '../helpers/identity.js'
import { User } from '../../models/index.js'
import { authService } from './auth.service.js'

export default {
    identitySSOLogin: async ({ session }) => {
        try {
            const identity = new Identity()
            const identityData = await identity.userDetails(session)

            const userDatum = identityData.data
            const email = identityData.data.email

            const existingUSer = await User.findOne({
                where: {
                    email,
                },
            })

            return existingUSer
                ? authService.login({ ...userDatum, email, session })
                : authService.signUp({
                      firstName: userDatum.firstName,
                      lastName: userDatum.lastName,
                      email,
                      session,
                  })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'CALLBACK_E2'
            )
        }
    },
}
