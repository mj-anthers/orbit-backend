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
            unique: true,
        },
        organization: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
        },
        userOrganization: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
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
    LeadProvider.hasMany(models.Lead, {
        foreignKey: 'leadProvider',
        as: 'leadProviderDatum',
        onDelete: 'CASCADE',
    })
}

LeadProvider.paginate = sequelizeCursorPaginate.makePaginate(LeadProvider)

export { LeadProvider, TABLE_NAME }
