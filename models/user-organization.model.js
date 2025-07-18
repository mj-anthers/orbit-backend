import { DataTypes } from 'sequelize'
import sequelize from '../config/db/database.js'

const TABLE_NAME = 'userOrganizations'

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
        },
        organization: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        userType: {
            type: DataTypes.ENUM('owner', 'user'),
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

export { UserOrganization, TABLE_NAME }
