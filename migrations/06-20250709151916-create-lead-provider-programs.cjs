'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // First define ENUM type (optional if using inline, but safer for reuse/drop)
        await queryInterface.sequelize.query(`
      CREATE TYPE enum_lead_provider_programs_base_rule AS ENUM ('any', 'all');
    `)
        await queryInterface.sequelize.query(`
      CREATE TYPE enum_lead_provider_programs_commission_base AS ENUM ('netRevenue', 'grossRevenue');
    `)
        await queryInterface.sequelize.query(`
      CREATE TYPE enum_lead_provider_programs_uninstallation_event AS ENUM (
        'neverExpire',
        'immediateExpire',
        'durationBasedExpire'
      );
    `)
        await queryInterface.createTable('leadProviderPrograms', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
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
            baseRule: {
                type: 'enum_lead_provider_programs_base_rule',
                allowNull: false,
            },
            commissionNeverExpire: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            commissionDuration: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            commissionBase: {
                type: 'enum_lead_provider_programs_commission_base',
                allowNull: false,
                defaultValue: 'netRevenue',
            },
            leadProviderProgramRequiresApproval: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            uninstallationEvent: {
                type: 'enum_lead_provider_programs_uninstallation_event',
                allowNull: false,
                defaultValue: 'neverExpire',
            },
            uninstallationDuration: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            shareableURLKey: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
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
        await queryInterface.dropTable('leadProviderPrograms')
        await queryInterface.sequelize.query(`DROP TYPE IF EXISTS enum_lead_provider_programs_uninstallation_event;`)
        await queryInterface.sequelize.query(`DROP TYPE IF EXISTS enum_lead_provider_programs_commission_base;`)
        await queryInterface.sequelize.query(`DROP TYPE IF EXISTS enum_lead_provider_programs_base_rule;`)

    },
}
