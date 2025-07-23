import { DataTypes } from 'sequelize'
import sequelizeCursorPaginate from 'sequelize-cursor-pagination'
import sequelize from '../config/db/database.js'

const TABLE_NAME = 'leadProviderPrograms'
const MODEL_NAME = 'LeadProviderProgram'

const LEAD_PROVIDER_PROGRAM_BASE_RULE_ENUM = {
    ANY: 'any',
    ALL: 'all',
}

const LEAD_PROVIDER_PROGRAM_TYPE_ENUM = {
    FIXED: 'fixed',
    PERCENT: 'percent',
}

const LEAD_PROVIDER_PROGRAM_COMMISSION_BASE_ENUM = {
    NET_REVENUE: 'netRevenue',
    GROSS_REVENUE: 'grossRevenue',
}

const LEAD_PROVIDER_PROGRAM_UNINSTALLATION_EVENT_ENUM = {
    NEVER_EXPIRE: 'neverExpire',
    IMMEDIATE_EXPIRE: 'immediateExpire',
    DURATION_BASED_EXPIRE: 'durationBasedExpire',
}

const LeadProviderProgram = sequelize.define(
    MODEL_NAME,
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        title: {
            type: DataTypes.STRING,
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
        baseRule: {
            type: DataTypes.ENUM(
                LEAD_PROVIDER_PROGRAM_BASE_RULE_ENUM.ANY,
                LEAD_PROVIDER_PROGRAM_BASE_RULE_ENUM.ALL
            ),
            allowNull: false,
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
        leadProviderProgramRequiresApproval: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
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
        shareableURLKey: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
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
        sequelize,
        modelName: MODEL_NAME,
        tableName: TABLE_NAME,
        timestamps: true,
    }
)

LeadProviderProgram.associate = (models) => {
    LeadProviderProgram.belongsTo(models.Organization, {
        foreignKey: 'organization',
        as: 'organizationDatum',
        onDelete: 'CASCADE',
    })
    LeadProviderProgram.hasMany(models.LeadProviderProgramCondition, {
        foreignKey: 'leadProviderProgram',
        as: 'conditions',
        onDelete: 'CASCADE',
    })
    LeadProviderProgram.hasMany(models.Lead, {
        foreignKey: 'leadProviderProgram',
        as: 'leads',
        onDelete: 'CASCADE',
    })
    LeadProviderProgram.hasMany(models.LeadProviderProgramCommissionEvent, {
        foreignKey: 'leadProviderProgram',
        as: 'commissionEvents',
        onDelete: 'CASCADE',
    })
    LeadProviderProgram.hasMany(models.LeadProvider, {
        foreignKey: 'leadProviderProgram',
        as: 'leadProviders',
        onDelete: 'CASCADE',
    })
}

LeadProviderProgram.paginate =
    sequelizeCursorPaginate.makePaginate(LeadProviderProgram)

export {
    LeadProviderProgram,
    TABLE_NAME,
    LEAD_PROVIDER_PROGRAM_BASE_RULE_ENUM,
    LEAD_PROVIDER_PROGRAM_TYPE_ENUM,
    LEAD_PROVIDER_PROGRAM_COMMISSION_BASE_ENUM,
    LEAD_PROVIDER_PROGRAM_UNINSTALLATION_EVENT_ENUM,
}
