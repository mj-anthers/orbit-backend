import { DataTypes } from 'sequelize'
import sequelize from '../config/db/database.js'

const TABLE_NAME = 'organizationSettings'

const OrganizationSetting = sequelize.define(
    'OrganizationSetting',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
        },
        organization: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        formData: {
            type: DataTypes.JSON,
            allowNull: true,
        },
    },
    {
        timestamps: true,
        tableName: TABLE_NAME,
    }
)

OrganizationSetting.associate = (models) => {
    OrganizationSetting.belongsTo(models.Organization, {
        foreignKey: 'organization',
        as: 'organizationDatum',
        onDelete: 'CASCADE',
    })
}

export { OrganizationSetting, TABLE_NAME }
