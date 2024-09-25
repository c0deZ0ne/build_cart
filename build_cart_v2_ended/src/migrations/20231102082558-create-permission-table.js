'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Permissions', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdById: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users', // Update with the correct model name if needed
          key: 'id', // Update with the correct column name if needed
        },
        onDelete: 'SET NULL',
      },
      updatedById: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users', // Update with the correct model name if needed
          key: 'id', // Update with the correct column name if needed
        },
        onDelete: 'SET NULL',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Permissions');
  },
};
