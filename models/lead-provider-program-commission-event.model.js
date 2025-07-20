import { DataTypes } from 'sequelize'
import sequelize from '../config/db/database.js'
import { COMMISSION_CALCULATION_TYPES } from './enum.js'

const TABLE_NAME = 'leadProviderProgramCommissionEvents'
const MODEL_NAME = 'LeadProviderProgramCommissionEvent'

const LeadProviderProgramCommissionEvent = sequelize.define(
    MODEL_NAME,
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        leadProviderProgram: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'leadProviderPrograms',
                key: 'id',
            },
            onDelete: 'CASCADE',
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

LeadProviderProgramCommissionEvent.associate = (models) => {
    LeadProviderProgramCommissionEvent.belongsTo(models.LeadProviderProgram, {
        foreignKey: 'leadProviderProgram',
        as: 'leadProviderProgramDatum',
        onDelete: 'CASCADE',
    })
}

export { LeadProviderProgramCommissionEvent }
