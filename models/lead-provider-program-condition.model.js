import { DataTypes } from 'sequelize'
import sequelizeCursorPaginate from 'sequelize-cursor-pagination'
import sequelize from '../config/db/database.js'

const TABLE_NAME = 'leadProviderProgramConditions'
const MODEL_NAME = 'leadProviderProgramConditions'

const LEAD_PROVIDER_PROGRAM_CONDITION_OPERATOR_ENUM = {
    IS: 'is',
    NOT: 'not',
    EQ: 'eq',
    NEQ: 'neq',
    GT: 'gt',
    GTE: 'gte',
    LT: 'lt',
    LTE: 'lte',
    IN: 'in',
    NIN: 'nin',
}

const LeadProviderProgramCondition = sequelize.define(
    MODEL_NAME,
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            unique: true,
            defaultValue: DataTypes.UUIDV4,
        },
        leadProviderProgram: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'leadProviderPrograms',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        organization: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'organizations',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        operator: {
            type: DataTypes.ENUM(
                ...Object.values(LEAD_PROVIDER_PROGRAM_CONDITION_OPERATOR_ENUM)
            ),
            allowNull: false,
        },
        values: {
            type: DataTypes.ARRAY(DataTypes.JSONB),
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

LeadProviderProgramCondition.associate = (models) => {
    LeadProviderProgramCondition.belongsTo(models.Organization, {
        foreignKey: 'organization',
        as: 'organizationDatum',
        onDelete: 'CASCADE',
    })

    LeadProviderProgramCondition.belongsTo(models.LeadProviderProgram, {
        foreignKey: 'leadProviderProgram',
        as: 'leadProviderProgramDatum',
        onDelete: 'CASCADE',
    })
}

LeadProviderProgramCondition.paginate = sequelizeCursorPaginate.makePaginate(
    LeadProviderProgramCondition
)

export {
    LeadProviderProgramCondition,
    TABLE_NAME,
    LEAD_PROVIDER_PROGRAM_CONDITION_OPERATOR_ENUM,
}
