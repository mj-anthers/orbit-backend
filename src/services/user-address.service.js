import httpStatus from 'http-status'
import { throwSpecificError } from '../middlewares/index.js'
import { AppError } from '../utils/index.js'
import { UserAddress } from '../../models/index.js'

export default {
    userAddressCreate: async ({
        type,
        addressLine1,
        addressLine2,
        city,
        province,
        postalCode,
        country,
        user,
    }) => {
        try {
            return await UserAddress.create({
                type,
                addressLine1,
                addressLine2,
                city,
                province,
                postalCode,
                country,
                user: user.id,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'USER_ADDRESS_E2'
            )
        }
    },

    userAddressList: async ({ user }) => {
        try {
            return await UserAddress.findAll({
                where: {
                    user: user.id,
                    isDeleted: false,
                },
                order: [['createdAt', 'DESC']],
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'USER_ADDRESS_E4'
            )
        }
    },

    userAddressDetails: async ({ id, user }) => {
        try {
            const address = await UserAddress.findOne({
                where: {
                    id,
                    user: user.id,
                    isDeleted: false,
                },
            })

            if (!address)
                throw new AppError(httpStatus.NOT_FOUND, 'USER_ADDRESS_E11')
            return address
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'USER_ADDRESS_E6'
            )
        }
    },

    userAddressUpdate: async ({
        id,
        user,
        type,
        addressLine1,
        addressLine2,
        city,
        province,
        postalCode,
        country,
    }) => {
        try {
            const [updated] = await UserAddress.update(
                {
                    type,
                    addressLine1,
                    addressLine2,
                    city,
                    province,
                    postalCode,
                    country,
                },
                {
                    where: {
                        id,
                        user: user.id,
                        isDeleted: false,
                    },
                }
            )

            if (updated === 0)
                throw new AppError(httpStatus.NOT_FOUND, 'USER_ADDRESS_E12')

            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'USER_ADDRESS_E8'
            )
        }
    },

    userAddressDelete: async ({ id, user }) => {
        try {
            const deleted = await UserAddress.update(
                {
                    isDeleted: true,
                    isActive: false,
                },
                {
                    where: {
                        id,
                        user: user.id,
                        isDeleted: false,
                    },
                }
            )

            if (deleted === 0)
                throw new AppError(httpStatus.NOT_FOUND, 'USER_ADDRESS_E13')

            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'USER_ADDRESS_E10'
            )
        }
    },
}
