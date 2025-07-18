import { DataTypes } from 'sequelize'
import sequelizeCursorPaginate from 'sequelize-cursor-pagination'

import sequelize from '../config/db/database.js'
import { ADDRESS_TYPE_ENUM } from './enum.js'

const TABLE_NAME = 'organizationAddresses'
const MODEL_NAME = 'OrganizationAddress'

const OrganizationAddress = sequelize.define(
    MODEL_NAME,
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        organization: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'organizations',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        type: {
            type: DataTypes.ENUM(...Object.values(ADDRESS_TYPE_ENUM)),
            allowNull: false,
            defaultValue: 'primary',
        },
        addressLine1: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        addressLine2: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        province: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        postalCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: TABLE_NAME,
        timestamps: true,
    }
)

OrganizationAddress.associate = (models) => {
    OrganizationAddress.belongsTo(models.Organization, {
        foreignKey: 'organization',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
}

OrganizationAddress.paginate =
    sequelizeCursorPaginate.makePaginate(OrganizationAddress)

export { OrganizationAddress }
