import { DataTypes } from 'sequelize'
import sequelize from '../config/db/database.js'
import { ADDRESS_TYPE_ENUM } from './enum.js'

const TABLE_NAME = 'userAddresses'
const MODEL_NAME = 'UserAddress'

const UserAddress = sequelize.define(
    MODEL_NAME,
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        user: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
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

UserAddress.associate = (models) => {
    UserAddress.belongsTo(models.User, {
        foreignKey: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
}
export { UserAddress, TABLE_NAME }
