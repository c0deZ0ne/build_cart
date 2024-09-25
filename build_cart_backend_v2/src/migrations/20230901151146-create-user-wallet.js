'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserWallets', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      UserId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      balance: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },
      account_number: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      totalCredit: {
        allowNull: false,
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },
      ActualSpend: {
        allowNull: false,
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },
      CreatedById: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint('UserWallets', {
      type: 'unique',
      fields: ['UserId'],
      name: 'unique_user_wallet',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeConstraint('UserWallets', 'unique_user_wallet');
    await queryInterface.dropTable('UserWallets');
  },
};
