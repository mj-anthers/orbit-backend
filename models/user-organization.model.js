import { DataTypes } from 'sequelize'
import sequelize from '../config/db/database.js'

const TABLE_NAME = 'userOrganizations'

const USER_ORGANIZATION_USER_TYPES = {
    OWNER: 'owner',
    USER: 'user',
}

const UserOrganization = sequelize.define(
    'UserOrganization',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
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
        userType: {
            type: DataTypes.ENUM(
                ...Object.values(USER_ORGANIZATION_USER_TYPES)
            ),
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
        modelName: 'UserOrganization',
        tableName: TABLE_NAME,
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['user', 'organization'],
            },
        ],
    }
)

UserOrganization.associate = (models) => {
    UserOrganization.belongsTo(models.User, {
        foreignKey: 'user',
        as: 'userDatum',
        onDelete: 'CASCADE',
    })
    UserOrganization.belongsTo(models.Organization, {
        foreignKey: 'organization',
        as: 'organizationDatum',
        onDelete: 'CASCADE',
    })
}

UserOrganization.addScope('forUser', (user) => ({
    where: {
        user,
        isActive: true,
        isDeleted: false,
    },
}))

export { UserOrganization, TABLE_NAME, USER_ORGANIZATION_USER_TYPES }
