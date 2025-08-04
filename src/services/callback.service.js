import httpStatus from 'http-status'
import { throwSpecificError } from '../middlewares/index.js'
import Identity from '../helpers/identity.js'
import { User } from '../../models/index.js'
import { authService } from './auth.service.js'
import { consoleLog } from '../utils/index.js'

export default {
    identitySSOLogin: async ({ session }) => {
        try {
            const identity = new Identity()
            const identityData = await identity.userDetails(session)

            const userDatum = identityData.data
            const email = identityData.data.email

            const existingUser = await User.findOne({
                where: {
                    email,
                },
            })

            existingUser.firstName = userDatum.firstName
            existingUser.lastName = userDatum.lastName
            await existingUser.save()

            return existingUser
                ? authService.login({ ...userDatum, email, session })
                : authService.signUp({
                      firstName: userDatum.firstName,
                      lastName: userDatum.lastName,
                      email,
                      session,
                  })
        } catch (error) {
            consoleLog(error)
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'CALLBACK_E2'
            )
        }
    },
}
