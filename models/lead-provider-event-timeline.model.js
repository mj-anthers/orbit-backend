import { DataTypes } from 'sequelize'
import sequelize from '../config/db/database.js'
import { TIMELINE_STATUS } from './enum.js'

const TABLE_NAME = 'leadProviderEventTimelines'
const MODEL_NAME = 'LeadProviderEventTimeline'

const LeadProviderEventTimeline = sequelize.define(
    MODEL_NAME,
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
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
        event: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        subEvent: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(...Object.values(TIMELINE_STATUS)),
            allowNull: false,
            defaultValue: TIMELINE_STATUS.PENDING,
        },
        meta: {
            type: DataTypes.JSONB,
            allowNull: true,
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

LeadProviderEventTimeline.associate = (models) => {
    LeadProviderEventTimeline.belongsTo(models.Organization, {
        foreignKey: 'organization',
        as: 'leadProviderOrganizationDatum',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })

    LeadProviderEventTimeline.belongsTo(models.LeadProvider, {
        foreignKey: 'leadProvider',
        as: 'leadProviderDatum',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
}

export { LeadProviderEventTimeline }
