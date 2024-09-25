'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Contracts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED'),
        defaultValue: 'PENDING',
      },
      deliveryStatus: {
        allowNull: false,
        type: Sequelize.ENUM('PROCESSING', 'DISPATCHED', 'DELIVERED'),
        defaultValue: 'PROCESSING',
      },
      paymentStatus: {
        allowNull: false,
        type: Sequelize.ENUM('PENDING', 'PROCESSING', 'CONFIRMED'),
        defaultValue: 'PENDING',
      },
      VendorId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Vendors',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      BuyerId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Buyers',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      RfqQuoteId: {
        unique: true,
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'RfqQuotes',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      RfqRequestId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'RfqRequests',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      dispatchedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      deliveredAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      paidAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      acceptedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      cancelledAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      completedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      isArchived: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Contracts');
  },
};
