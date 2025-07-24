import { DataTypes } from 'sequelize'
import sequelize from '../config/db/database.js'
import sequelizeCursorPaginate from 'sequelize-cursor-pagination'

const TABLE_NAME = 'organizations'
const MODEL_NAME = 'Organization'

const ORGANIZATION_TYPES = {
    PRODUCT: 'product',
    SERVICE: 'service',
}

const Organization = sequelize.define(
    MODEL_NAME,
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
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                name: 'organizations_name_key',
            },
        },
        type: {
            type: DataTypes.ENUM(...Object.values(ORGANIZATION_TYPES)),
            allowNull: false,
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

Organization.addHook('afterCreate', async (datum, options) => {
    const { OrganizationSetting, OrganizationMeta } = sequelize.models

    await OrganizationSetting.create(
        {
            organization: datum.id,
        },
        options.transaction ? { transaction: options.transaction } : {}
    )

    await OrganizationMeta.create(
        {
            organization: datum.id,
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
    Organization.hasMany(models.Customer, {
        foreignKey: 'organization',
        as: 'organizationCustomerDatum',
        onDelete: 'CASCADE',
    })
}

Organization.paginate = sequelizeCursorPaginate.makePaginate(Organization)

export { Organization, TABLE_NAME, ORGANIZATION_TYPES }
