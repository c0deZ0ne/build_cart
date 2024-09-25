'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MyProjects', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      UserId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      SharedProjectId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'SharedProjects',
          key: 'id',
          onDelete: 'CASCADE',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      migratedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('MyProjects', {
      unique: true,
      fields: ['SharedProjectId', 'UserId'],
      name: 'my_projects_shared_project_user_unique',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('MyProjects');
  },
};
