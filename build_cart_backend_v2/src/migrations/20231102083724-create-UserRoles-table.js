'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserRoles', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      UserId: {
        type: Sequelize.UUID, // Adjust the data type if needed
        allowNull: false,
        references: {
          model: 'Users', // Adjust to match your actual table name
          key: 'id', // Update with the correct column name if needed
        },
      },
      RoleId: {
        type: Sequelize.UUID, // Adjust the data type if needed
        allowNull: false,
        references: {
          model: 'Roles', // Adjust to match your actual table name
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
    await queryInterface.dropTable('UserRoles'); // Pluralized 'UserRoles'
  },
};
