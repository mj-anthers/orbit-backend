'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.sequelize.query(`
      CREATE TYPE "events_status" AS ENUM ('pending', 'successful', 'failed');
    `);

    await queryInterface.createTable('leadProviderEventTimelines', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      organization: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'organizations',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      leadProvider: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'leadProviders',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      event: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subEvent: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: 'events_status',
        allowNull: false,
        defaultValue: 'pending',
      },
      meta: {
        type: Sequelize.JSONB,
        allowNull: true,
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
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop table
    await queryInterface.dropTable('leadProviderEventTimelines');

    // Drop ENUM type
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "events_status";
    `);
  },
};