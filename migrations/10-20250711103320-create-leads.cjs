'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(
            `CREATE TYPE enum_lead_status AS ENUM ('pending', 'rejected', 'approved', 'lost');`
        )
        await queryInterface.sequelize.query(
            `CREATE TYPE enum_lead_source AS ENUM ('organization', 'leadProvider');`
        )

        await queryInterface.createTable('leads', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUID,
                primaryKey: true,
                unique: true,
                allowNull: false
            },
            leadProvider: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'leadProviders',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            user: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            leadProviderProgram: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'leadProviderPrograms',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
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
            customer: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'customers',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            effectiveDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            status: {
                type: 'enum_lead_status',
                allowNull: false,
                defaultValue: 'pending',
            },
            installStatus: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            installDate: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: null,
            },
            country: {
                type: Sequelize.STRING(3),
                allowNull: true,
                defaultValue: null,
            },
            platformPlanName: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null,
            },
            platformPlanPrice: {
                type: Sequelize.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
            appPlanName: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null,
            },
            appPlanPrice: {
                type: Sequelize.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
            uninstallationDate: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: null,
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
            notes: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null,
            },
            leadSource: {
                type: 'enum_lead_source',
                allowNull: false,
            },
            createdBy: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            isDeleted: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        })
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('leads')
        await queryInterface.sequelize.query(
            `DROP TYPE IF EXISTS enum_lead_status;`
        )
        await queryInterface.sequelize.query(
            `DROP TYPE IF EXISTS enum_lead_source;`
        )
    },
}
