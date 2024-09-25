'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ProjectWallets', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      ProjectId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Projects', // Update with your actual project model name
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      balance: {
        allowNull: false,
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
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
    await queryInterface.dropTable('ProjectWallets');
  },
};
