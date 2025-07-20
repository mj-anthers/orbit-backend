'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
        `CREATE TYPE enum_commission_types AS ENUM ('recurring', 'oneTime');`
    )
    await queryInterface.sequelize.query(
        `CREATE TYPE enum_credit_debit AS ENUM ('credit', 'debit');`
    )

    await queryInterface.createTable('commissions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
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
      lead: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'leads',
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
      commissionType: {
        type: 'enum_commission_types',
        allowNull: false,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'INR',
      },
      creditOrDebit: {
        type: 'enum_credit_debit',
        allowNull: false,
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
    await queryInterface.dropTable('commissions')
    await queryInterface.sequelize.query(
        `DROP TYPE IF EXISTS enum_commission_types;`
    )
    await queryInterface.sequelize.query(
        `DROP TYPE IF EXISTS enum_credit_debit;`
    )
  },
}
