'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'walletId', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUID4,
      allowNull: true,
      references: {
        model: 'UserWallets',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addColumn('Projects', 'walletId', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUID4,
      allowNull: true,
      references: {
        model: 'ProjectWallets',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'walletId');
    await queryInterface.removeColumn('Projects', 'walletId');
  },
};
