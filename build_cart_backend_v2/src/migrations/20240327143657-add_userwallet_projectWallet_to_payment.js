'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add walletId column
    await queryInterface.addColumn('Payments', 'walletId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'UserWallets',
        key: 'id',
        onDelete: 'SET NULL',
      },
    });

    // Add ProjectWalletId column
    await queryInterface.addColumn('Payments', 'ProjectWalletId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'ProjectWallets',
        key: 'id',
        onDelete: 'SET NULL',
      },
    });
    // Add OrderId column
    await queryInterface.addColumn('Payments', 'OrderId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Orders',
        key: 'id',
        onDelete: 'SET NULL',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove walletId column
    await queryInterface.removeColumn('Payments', 'walletId');
    // Remove ProjectWalletId column
    await queryInterface.removeColumn('Payments', 'ProjectWalletId');
    await queryInterface.removeColumn('Payments', 'OrderId');
  }
};
