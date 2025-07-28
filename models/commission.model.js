import { DataTypes } from 'sequelize'
import sequelize from '../config/db/database.js'

const TABLE_NAME = 'commissions'
const MODEL_NAME = 'Commission'

const COMMISSION_TYPES = Object.freeze({
    RECURRING: 'recurring',
    ONE_TIME: 'oneTime',
})

const CREDIT_DEBIT_ENUM = Object.freeze({
    CREDIT: 'credit',
    DEBIT: 'debit',
})

const Commission = sequelize.define(
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
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        leadProvider: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'leadProviders',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        lead: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'leads',
                key: 'id',
            },
        },
        leadProviderProgram: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'leadProviderPrograms',
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
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'INR',
        },
        commissionType: {
            type: DataTypes.ENUM(...Object.values(COMMISSION_TYPES)),
            allowNull: false,
        },
        creditOrDebit: {
            type: DataTypes.ENUM(...Object.values(CREDIT_DEBIT_ENUM)),
            allowNull: false,
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

Commission.associate = (models) => {
    Commission.belongsTo(models.User, {
        foreignKey: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    Commission.belongsTo(models.LeadProvider, {
        foreignKey: 'leadProvider',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    Commission.belongsTo(models.Lead, {
        foreignKey: 'lead',
        onDelete: 'CASCADE',
    })
}

export { Commission, COMMISSION_TYPES, CREDIT_DEBIT_ENUM }
