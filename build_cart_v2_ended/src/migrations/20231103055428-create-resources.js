// migrations/<timestamp>-create-resources.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Resources', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdById: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users', // Adjust to match your actual table name
          key: 'id', // Update with the correct column name if needed
        },
        onDelete: 'SET NULL',
      },
      referenceId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      updatedById: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users', // Adjust to match your actual table name
          key: 'id', // Update with the correct column name if needed
        },
        onDelete: 'SET NULL',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Resources');
  },
};
