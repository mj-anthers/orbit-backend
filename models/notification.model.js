import { DataTypes } from 'sequelize'
import sequelize from '../config/db/database.js'
import sequelizeCursorPaginate from 'sequelize-cursor-pagination'

const TABLE_NAME = 'notifications'
const MODEL_NAME = 'Notification'

const Notification = sequelize.define(
    MODEL_NAME,
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        event: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        organization: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        template: {
            type: DataTypes.TEXT,
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

Notification.associate = (models) => {
    Notification.belongsTo(models.Organization, {
        foreignKey: 'organization',
        as: 'notificationOrganizationDatum',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
}

Notification.paginate = sequelizeCursorPaginate.makePaginate(Notification)

export { Notification }
