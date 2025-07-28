import httpStatus from 'http-status'
import { throwSpecificError } from '../middlewares/index.js'
import { AppError } from '../utils/index.js'
import { OrganizationAddress } from '../../models/index.js'
import { Op } from 'sequelize'

export default {
    organizationAddressCreate: async ({
        organization,
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
            return await OrganizationAddress.create({
                organization,
                type,
                addressLine1,
                addressLine2,
                city,
                province,
                postalCode,
                country,
                createdBy: user.id,
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_ADDRESS_E2'
            )
        }
    },

    organizationAddressList: async ({ user }) => {
        try {
            return await OrganizationAddress.findAll({
                where: {
                    organization: {
                        [Op.in]: user.organizationIds,
                    },
                    isDeleted: false,
                },
                order: [['createdAt', 'DESC']],
            })
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_ADDRESS_E4'
            )
        }
    },

    organizationAddressDetails: async ({ id, user }) => {
        try {
            const address = await OrganizationAddress.findOne({
                where: {
                    id,
                    organization: {
                        [Op.in]: user.organizationIds,
                    },
                    isDeleted: false,
                },
            })

            if (!address)
                throw new AppError(
                    httpStatus.NOT_FOUND,
                    'ORGANIZATION_ADDRESS_E11'
                )
            return address
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_ADDRESS_E6'
            )
        }
    },

    organizationAddressUpdate: async ({
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
            const [updated] = await OrganizationAddress.update(
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
                        organization: {
                            [Op.in]: user.organizationIds,
                        },
                        isDeleted: false,
                    },
                }
            )

            if (updated === 0)
                throw new AppError(
                    httpStatus.NOT_FOUND,
                    'ORGANIZATION_ADDRESS_E12'
                )

            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_ADDRESS_E8'
            )
        }
    },

    organizationAddressDelete: async ({ id, user }) => {
        try {
            const [updated] = await OrganizationAddress.update(
                {
                    isDeleted: true,
                    isActive: false,
                },
                {
                    where: {
                        id,
                        organization: {
                            [Op.in]: user.organizationIds,
                        },
                        isDeleted: false,
                    },
                }
            )

            if (updated === 0)
                throw new AppError(
                    httpStatus.NOT_FOUND,
                    'ORGANIZATION_ADDRESS_E13'
                )

            return true
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'ORGANIZATION_ADDRESS_E10'
            )
        }
    },
}
