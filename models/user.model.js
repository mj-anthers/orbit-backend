import { DataTypes } from 'sequelize'
import sequelize from '../config/db/database.js'
import { hashPassword } from '../src/utils/index.js'

const MODEL_NAME = 'User'
const TABLE_NAME = 'users'

const USER_TYPES = {
    WEB: 'web',
    GOOGLE: 'google',
    FACEBOOK: 'facebook',
    SHOPIFY: 'shopify',
    LEAD_PROVIDER: 'leadProvider',
}

const User = sequelize.define(
    MODEL_NAME,
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                name: 'users_email_key', // Explicit constraint name
            },
            validate: {
                isEmail: true,
            },
        },
        phoneNumber: {
            type: DataTypes.STRING(20),
            unique: true,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        source: {
            type: DataTypes.ENUM(
                USER_TYPES.WEB,
                USER_TYPES.GOOGLE,
                USER_TYPES.FACEBOOK,
                USER_TYPES.SHOPIFY,
                USER_TYPES.LEAD_PROVIDER
            ),
            allowNull: false,
            defaultValue: USER_TYPES.WEB,
        },
        magicLinkToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        magicLinkExpiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        resetToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        resetTokenExpiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        invitationToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        invitationExpiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        lastLoginAt: {
            type: DataTypes.DATE,
            allowNull: true,
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
        timestamps: true,
        modelName: MODEL_NAME,
        tableName: TABLE_NAME,
        // Hash password before create
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    user.password = await hashPassword(user.password)
                }
            },

            // Hash password before update if it changed
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    user.password = user.password = await hashPassword(
                        user.password
                    )
                }
            },
        },
    }
)

User.associate = (models) => {
    User.hasMany(models.Organization, {
        foreignKey: 'user',
        as: 'organizations',
        onDelete: 'CASCADE',
    })
    User.hasMany(models.UserOrganization, {
        foreignKey: 'user',
        as: 'userOrganizations',
        onDelete: 'CASCADE',
    })
    User.hasMany(models.LeadProvider, {
        foreignKey: 'user',
        as: 'userLeadProviderDatum',
        onDelete: 'CASCADE',
    })
    User.hasMany(models.LeadProvider, {
        foreignKey: 'createdBy',
        as: 'userCreatedByDatum',
        onDelete: 'CASCADE',
    })
    User.hasMany(models.Lead, {
        foreignKey: 'user',
        as: 'leadUserDatum',
        onDelete: 'CASCADE',
    })
    User.hasMany(models.Lead, {
        foreignKey: 'createdBy',
        as: 'leadCreatedByDatum',
        onDelete: 'CASCADE',
    })
    User.hasMany(models.UserAddress, {
        foreignKey: 'user',
        as: 'userAddresses',
        onDelete: 'CASCADE',
    })
    User.hasMany(models.LeadProviderComment, {
        foreignKey: 'createdBy',
        as: 'userLeadProviderComments',
        onDelete: 'CASCADE',
    })
}

export { User, TABLE_NAME, USER_TYPES }
