'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RfqBargains', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      price: {
        allowNull: false,
        type: Sequelize.DECIMAL(15, 2),
      },
      ProjectId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: false,
        references: {
          model: 'Projects', // Assuming your Project model is in the 'Projects' table
          key: 'id',
        },
      },
      RfqQuoteId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'RfqQuotes', // Assuming your RfqQuote model is in the 'RfqQuotes' table
          key: 'id',
        },
      },
      deliveryDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      CreatedById: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users', // Assuming your User model is in the 'Users' table
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      migratedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('ACCEPTED', 'PENDING', 'REJECTED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('RfqBargains');
  },
};
