import { DataTypes } from 'sequelize'
import sequelizeCursorPaginate from 'sequelize-cursor-pagination'
import sequelize from '../config/db/database.js'

const TABLE_NAME = 'leadProviders'
const MODEL_NAME = 'LeadProvider'

const LeadProvider = sequelize.define(
    MODEL_NAME,
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
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
        userOrganization: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'userOrganizations',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
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

LeadProvider.addHook('afterCreate', async (datum, options) => {
    const { LeadProviderMeta } = sequelize.models

    await LeadProviderMeta.create(
        {
            leadProvider: datum.id,
        },
        options.transaction ? { transaction: options.transaction } : {}
    )
})

LeadProvider.associate = (models) => {
    LeadProvider.belongsTo(models.Organization, {
        foreignKey: 'organization',
        as: 'organizationDatum',
        onDelete: 'CASCADE',
    })
    LeadProvider.belongsTo(models.UserOrganization, {
        foreignKey: 'userOrganization',
        as: 'userOrganizationDatum',
        onDelete: 'CASCADE',
    })
    LeadProvider.belongsTo(models.User, {
        foreignKey: 'user',
        as: 'userLeadProviderDatum',
        onDelete: 'CASCADE',
    })
    LeadProvider.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'userCreatedByDatum',
        onDelete: 'CASCADE',
    })
    LeadProvider.belongsTo(models.LeadProviderProgram, {
        foreignKey: 'leadProviderProgram',
        as: 'leadProviderProgramDatum',
        onDelete: 'CASCADE',
    })
    LeadProvider.hasMany(models.Lead, {
        foreignKey: 'leadProvider',
        as: 'leadProviderLeads',
        onDelete: 'CASCADE',
    })
    LeadProvider.hasOne(models.LeadProviderMeta, {
        foreignKey: 'leadProvider',
        as: 'leadProviderMetaDatum',
        onDelete: 'CASCADE',
    })
}

LeadProvider.paginate = sequelizeCursorPaginate.makePaginate(LeadProvider)

export { LeadProvider, TABLE_NAME }
