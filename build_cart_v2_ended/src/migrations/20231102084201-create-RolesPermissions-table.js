'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RolePermissions', {
      // Pluralized 'RolePermissions'
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      RoleId: {
        type: Sequelize.UUID, // Adjust the data type if needed
        allowNull: false,
        references: {
          model: 'Roles', // Adjust to match your actual table name
          key: 'id', // Update with the correct column name if needed
        },
      },
      PermissionId: {
        type: Sequelize.UUID, // Adjust the data type if needed
        allowNull: false,
        references: {
          model: 'Permissions', // Adjust to match your actual table name
          key: 'id', // Update with the correct column name if needed
        },
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('RolePermissions'); // Pluralized 'RolePermissions'
  },
};
