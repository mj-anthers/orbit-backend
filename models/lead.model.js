import { DataTypes } from 'sequelize'
import sequelize from '../config/db/database.js'
import sequelizeCursorPaginate from 'sequelize-cursor-pagination'
import {
    LEAD_PROVIDER_PROGRAM_COMMISSION_BASE_ENUM,
    LEAD_PROVIDER_PROGRAM_UNINSTALLATION_EVENT_ENUM,
} from './lead-provider-program.model.js'

const MODEL_NAME = 'Lead'
const TABLE_NAME = 'leads'

const LEAD_STATUS_ENUM = Object.freeze({
    PENDING: 'pending',
    REJECTED: 'rejected',
    APPROVED: 'approved',
    LOST: 'lost',
})

const LEAD_SOURCE_ENUM = Object.freeze({
    ORGANIZATION: 'organization',
    LEAD_PROVIDER: 'leadProvider',
})

const Lead = sequelize.define(
    MODEL_NAME,
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
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
        leadProviderProgram: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'leadProviderProgrammes',
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
        customer: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        effectiveDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(...Object.values(LEAD_STATUS_ENUM)),
            allowNull: false,
            defaultValue: 'pending',
        },
        installStatus: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        installDate: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
        country: {
            type: DataTypes.STRING(3),
            allowNull: true,
            defaultValue: null,
        },
        platformPlanName: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        platformPlanPrice: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        appPlanName: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        appPlanPrice: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        uninstallationDate: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
        commissionNeverExpire: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        commissionDuration: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        commissionBase: {
            type: DataTypes.ENUM(
                ...Object.values(LEAD_PROVIDER_PROGRAM_COMMISSION_BASE_ENUM)
            ),
            allowNull: false,
            defaultValue:
                LEAD_PROVIDER_PROGRAM_COMMISSION_BASE_ENUM.NET_REVENUE,
        },
        uninstallationEvent: {
            type: DataTypes.ENUM(
                ...Object.values(
                    LEAD_PROVIDER_PROGRAM_UNINSTALLATION_EVENT_ENUM
                )
            ),
            allowNull: false,
            defaultValue:
                LEAD_PROVIDER_PROGRAM_UNINSTALLATION_EVENT_ENUM.NEVER_EXPIRE,
        },
        uninstallationDuration: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        leadSource: {
            type: DataTypes.ENUM(...Object.values(LEAD_SOURCE_ENUM)),
            allowNull: false,
        },
        createdBy: {
            type: DataTypes.UUID,
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

Lead.associate = (models) => {
    Lead.belongsTo(models.Customer, {
        foreignKey: 'customer',
        as: 'customerDatum',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    Lead.belongsTo(models.LeadProvider, {
        foreignKey: 'leadProvider',
        as: 'leadProviderDatum',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    Lead.belongsTo(models.Organization, {
        foreignKey: 'organization',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    Lead.belongsTo(models.User, {
        foreignKey: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    Lead.belongsTo(models.LeadProviderProgram, {
        foreignKey: 'leadProviderProgram',
        as: 'leadProviderProgramDatum',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    Lead.belongsTo(models.User, {
        foreignKey: 'createdBy',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    Lead.hasMany(models.LeadCommissionEvent, {
        foreignKey: 'lead',
        as: 'commissionEvents',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
}

Lead.paginate = sequelizeCursorPaginate.makePaginate(Lead)

export { Lead, LEAD_STATUS_ENUM, LEAD_SOURCE_ENUM }
