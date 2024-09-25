// migrations/<timestamp>-create-permission-resources.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PermissionResources', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      PermissionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Permissions',
          key: 'id',
          onDelete: 'CASCADE',
        },
      },
      ResourceId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Resources',
          key: 'id',
          onDelete: 'CASCADE',
        },
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
    await queryInterface.dropTable('PermissionResources');
  },
};
