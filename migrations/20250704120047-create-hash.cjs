'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('hashes', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                unique: true,
            },
            key: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            hash: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            storeUrl: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            expiry: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('NOW()'),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('NOW()'),
            },
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('hashes')
    },
}
