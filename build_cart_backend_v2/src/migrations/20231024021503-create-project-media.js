'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ProjectMedia', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      ProjectId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Projects', // Make sure it matches your actual table name for Project
          key: 'id',
        },
      },
      url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      mediaType: {
        type: Sequelize.ENUM('VIDEO', 'IMAGE', 'FILE'),
        allowNull: false,
      },
      CreatedById: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users', // Make sure it matches your actual table name for User
          key: 'id',
        },
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      migratedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ProjectMedia');
  },
};
