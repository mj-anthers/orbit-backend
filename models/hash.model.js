import { DataTypes } from 'sequelize'
import sequelize from '../config/db/database.js'

const TABLE_NAME = 'hashes'

const Hash = sequelize.define(
    'Hash',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        storeUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expiry: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        tableName: 'hashes',
    }
)

export default { Hash, TABLE_NAME }
