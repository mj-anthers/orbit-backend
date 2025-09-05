'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`CREATE TYPE enum_users_source AS ENUM ('web', 'google', 'facebook', 'shopify', 'leadProvider');`);

        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUID,
                primaryKey: true,
                unique: true,
                allowNull: false
            },
            firstName: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            lastName: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            source: {
                type: 'enum_users_source',
                allowNull: false,
                defaultValue: 'web',
            },
            magicLinkToken: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            magicLinkExpiry: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            resetToken: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            resetTokenExpiry: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            invitationToken: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            invitationExpiry: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            lastLoginAt: {
                type: Sequelize.DATE,
                allowNull: true,
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
        await queryInterface.dropTable('users')
        await queryInterface.sequelize.query(
            `DROP TYPE IF EXISTS "enum_users_source";`
        )
    },
}
