import { DataTypes } from 'sequelize'
import sequelize from '../config/db/database.js'

const TABLE_NAME = 'customers'
const MODEL_NAME = 'Customer'

const Customer = sequelize.define(
    MODEL_NAME,
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        organization: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'organizations',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: MODEL_NAME,
        tableName: TABLE_NAME,
        timestamps: true,
    }
)

Customer.associate = (models) => {
    Customer.belongsTo(models.Organization, {
        foreignKey: 'organization',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })

    Customer.hasMany(models.Lead, {
        foreignKey: 'customer',
        as: 'customerLeads',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
}

export { Customer }
