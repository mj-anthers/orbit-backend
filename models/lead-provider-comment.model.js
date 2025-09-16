import { DataTypes } from 'sequelize'
import sequelizeCursorPaginate from 'sequelize-cursor-pagination'
import sequelize from '../config/db/database.js'
import { Lead } from './lead.model.js'

const MODEL_NAME = 'LEAD_PROVIDER_COMMENT'
const TABLE_NAME = 'leadProviderComments'

const LeadProviderComment = sequelize.define(
    MODEL_NAME,
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
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
        leadProvider: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'leadProviders',
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
        comment: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        attachments: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
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

LeadProviderComment.associate = (models) => {
    LeadProviderComment.belongsTo(models.Organization, {
        foreignKey: 'organization',
        as: 'leadProviderCommentOrganizationDatum',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    LeadProviderComment.belongsTo(models.LeadProvider, {
        foreignKey: 'leadProvider',
        as: 'leadProviderCommentDatum',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    LeadProviderComment.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'leadProviderCommentCreatedByDatum',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
}

LeadProviderComment.paginate =
    sequelizeCursorPaginate.makePaginate(LeadProviderComment)

export { LeadProviderComment }
