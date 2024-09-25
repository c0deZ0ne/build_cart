'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Invitations', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      recipientEmail: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        allowNull: false,
        defaultValue: 'PENDING',
        type: Sequelize.ENUM('PENDING', 'ACCEPT', 'DECLINE'),
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
      migratedAt: {
        type: Sequelize.DATE,
        allowNull: true,
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
    await queryInterface.dropTable('Invitations');
  },
};
