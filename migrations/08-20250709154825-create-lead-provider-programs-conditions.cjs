'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`CREATE TYPE enum_lead_provider_program_condition_operator AS ENUM ('is', 'not', 'eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'nin');`);

        await queryInterface.createTable('leadProviderProgramConditions', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            leadProviderProgram: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'leadProviderPrograms',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            organization: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'organizations',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            operator: {
                type: 'enum_lead_provider_program_condition_operator',
                allowNull: false,
            },
            values: {
                type: Sequelize.ARRAY(Sequelize.JSONB),
                allowNull: false,
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            isDeleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        })
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('leadProviderProgramConditions')
        await queryInterface.sequelize.query(`DROP TYPE IF EXISTS enum_lead_provider_program_condition_operator;`);
    },
}
