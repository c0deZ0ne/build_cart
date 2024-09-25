'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Escrows', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      orderId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Orders',
          key: 'id',
        },
      },
      contractId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Contracts',
          key: 'id',
        },
      },
      projectId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Projects',
          key: 'id',
        },
      },
      rfqRequestId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'RfqRequests',
          key: 'id',
        },
      },
      initialPrice: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2),
      },
      commisionPercentage: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      commisionValue: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2),
      },
      finalAmount: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2),
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('PENDING', 'CANCELLED', 'CLOSED', 'COMPLETED'),
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable('Commissions', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      percentageNumber: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      active: {
        allowNull: true,
        defaultValue: true,
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Escrows');
    await queryInterface.dropTable('Commissions');
  },
};
