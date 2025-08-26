import httpStatus from 'http-status'
import { throwSpecificError } from '../middlewares/index.js'
import Identity from '../helpers/identity.js'
import { User } from '../../models/index.js'
import { authService } from './auth.service.js'
import { consoleLog } from '../utils/index.js'
import Redis from '../../redis/index.js'

export default {
    identitySSOLogin: async ({ session }) => {
        try {
            const identity = new Identity()
            const identityData = await identity.userDetails(session)

            const identityUserDatum = identityData.data
            const email = identityData.data.email

            await Redis.setIdentityUserToken(email, session)

            const existingUser = await User.findOne({
                where: {
                    email,
                },
            })

            if (existingUser) {
                existingUser.firstName = identityUserDatum.firstName
                existingUser.lastName = identityUserDatum.lastName
                await existingUser.save()
            }

            const userDatum = existingUser
                ? await authService.login({
                      ...identityUserDatum,
                      email,
                      session,
                  })
                : await authService.signUp({
                      firstName: identityUserDatum.firstName,
                      lastName: identityUserDatum.lastName,
                      email,
                      session,
                  })

            return {
                ...userDatum.user,
                token: userDatum.token,
                sessionSwitchToken: identityUserDatum.sessionSwitchToken,
            }
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
