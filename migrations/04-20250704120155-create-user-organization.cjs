'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('userOrganizations', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUID,
                primaryKey: true,
                unique: true,
                allowNull: false
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
            userType: {
                type: Sequelize.ENUM('owner', 'user'),
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
                defaultValue: Sequelize.literal('NOW()'),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('NOW()'),
            },
        })

        // Add unique composite index on user + company
        await queryInterface.addIndex('userOrganizations', ['user', 'organization'], {
            unique: true,
            name: 'user_organization_unique_idx',
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex(
            'userOrganizations',
            'user_organization_unique_idx'
        )
        await queryInterface.dropTable('userOrganizations')
        await queryInterface.sequelize.query(
            `DROP TYPE IF EXISTS "enum_userOrganizations_userType";`
        )
    },
}
