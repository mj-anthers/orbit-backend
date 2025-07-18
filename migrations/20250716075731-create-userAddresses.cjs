'use strict'

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('userAddresses', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
                unique: true,
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
            type: {
                type: 'address_type',
                allowNull: false,
                defaultValue: 'primary',
            },
            addressLine1: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            addressLine2: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            city: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            province: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            postalCode: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            country: {
                type: Sequelize.STRING,
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

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('userAddresses')
    },
}
