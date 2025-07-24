// models/OrganizationMeta.js
import { DataTypes } from 'sequelize'
import sequelize from '../config/db/database.js'

const MODEL_NAME = 'OrganizationMeta'
const TABLE_NAME = 'organizationMeta'

const OrganizationMeta = sequelize.define(
    MODEL_NAME,
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
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
        taxInfo: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
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
        modelName: MODEL_NAME,
        timestamps: true,
    }
)

export { OrganizationMeta }
