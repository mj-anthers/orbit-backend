import { DataTypes } from 'sequelize'
import sequelize from '../config/db/database.js'

const TABLE_NAME = 'organizations'

const Organization = sequelize.define(
    'Organization',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
        },
        user: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                name: 'organizations_name_key', // Explicit constraint name
            },
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
        modelName: 'Organization',
        tableName: TABLE_NAME,
        timestamps: true,
    }
)

Organization.addHook('afterCreate', async (org, options) => {
    const { OrganizationSetting } = sequelize.models

    await OrganizationSetting.create(
        {
            organization: org.id,
        },
        options.transaction ? { transaction: options.transaction } : {}
    )
})

Organization.associate = (models) => {
    Organization.hasMany(models.UserOrganization, {
        foreignKey: 'organization',
        as: 'userOrganizations',
        onDelete: 'CASCADE',
    })
    Organization.belongsTo(models.User, {
        foreignKey: 'user',
        as: 'userDatum',
        onDelete: 'CASCADE',
    })
    Organization.hasOne(models.OrganizationSetting, {
        foreignKey: 'organization',
        as: 'organizationSettingDatum',
        onDelete: 'CASCADE',
    })
    Organization.hasOne(models.OrganizationAddress, {
        foreignKey: 'organization',
        as: 'organizationAddresses',
        onDelete: 'CASCADE',
    })
}

export { Organization, TABLE_NAME }
