import { DataTypes } from 'sequelize'
import sequelize from '../config/db/database.js'
import { COMMISSION_CALCULATION_TYPES } from './enum.js'

const TABLE_NAME = 'leadCommissionEvents'
const MODEL_NAME = 'LeadCommissionEvent'

const LeadCommissionEvent = sequelize.define(
    MODEL_NAME,
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        lead: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'leads',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
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
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        commissionBasis: {
            type: DataTypes.ENUM(
                ...Object.values(COMMISSION_CALCULATION_TYPES)
            ),
            allowNull: false,
            defaultValue: COMMISSION_CALCULATION_TYPES.FIXED,
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

LeadCommissionEvent.associate = (models) => {
    LeadCommissionEvent.belongsTo(models.Lead, {
        foreignKey: 'lead',
        as: 'leadCommissionEvents',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
}
export { LeadCommissionEvent }
