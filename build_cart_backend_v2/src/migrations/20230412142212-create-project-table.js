'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Projects', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      CreatedById: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
          onDelete: 'SET NULL',
        },
        allowNull: true,
      },
      UpdatedById: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
          onDelete: 'SET NULL',
        },
        allowNull: true,
      },
      BuyerId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Buyers',
          key: 'id',
          onDelete: 'CASCADE',
        },
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('ARCHIVE', 'ACTIVE'),
        defaultValue: 'ACTIVE',
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Projects');
  },
};
