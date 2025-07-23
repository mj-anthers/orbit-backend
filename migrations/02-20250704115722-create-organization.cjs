'use strict'

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`CREATE TYPE enum_organization_types AS ENUM ('product', 'service');`);

        await queryInterface.createTable('organizations', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
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
                type: 'enum_organization_types',
                allowNull: false,
            },
            name: {
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
        await queryInterface.dropTable('organizations')
        await queryInterface.sequelize.query(
            `DROP TYPE IF EXISTS "enum_organization_types";`
        )
    },
}
