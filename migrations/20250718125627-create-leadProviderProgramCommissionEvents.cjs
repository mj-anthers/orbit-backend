'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.sequelize.query(`
      CREATE TYPE enum_commission_calculation_type AS ENUM ('fixed', 'percent');
    `)
        await queryInterface.createTable(
            'leadProviderProgramCommissionEvents',
            {
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
                amount: {
                    type: Sequelize.FLOAT,
                    allowNull: false,
                },
                commissionBasis: {
                    type: 'enum_commission_calculation_type',
                    allowNull: false,
                    defaultValue: 'fixed',
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
            }
        )
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable('leadProviderProgramCommissionEvents')
        await queryInterface.sequelize.query(
            `DROP TYPE IF EXISTS enum_commission_calculation_type;`
        )
    },
}
