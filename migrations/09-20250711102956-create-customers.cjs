'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('customers', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            phoneNumber: {
                type: Sequelize.STRING,
                allowNull: true,
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
        await queryInterface.dropTable('customers')
    },
}
