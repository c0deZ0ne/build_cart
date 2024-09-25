'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserProjectWallets', {
      userId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Users', // Update with your actual user model name
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      projectWalletId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'ProjectWallets', // Update with the actual table name
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('UserProjectWallets');
  },
};
