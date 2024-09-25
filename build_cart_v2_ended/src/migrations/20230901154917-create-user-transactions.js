'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserTransactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      UserWalletId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'UserWallets',
          key: 'id',
        },
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      ItemTypes: {
        type: Sequelize.ENUM('RFQ_REQUEST', 'PROJECT', 'WALLET'),
        allowNull: false,
      },
      paymentMethod: {
        type: Sequelize.ENUM(
          'BANK_TRANSFER',
          'CREDIT_CARD',
          'BANK_USSD',
          'MOBILE_MONEY',
          'CUTSTRUCT_PAY',
        ),
        allowNull: false,
      },
      paymentProvider: {
        type: Sequelize.ENUM(
          'PAYSTACK',
          'FLUTTERWAVE',
          'BANI',
          'CUTSTRUCT',
          'PAYPAL',
        ),
        defaultValue: 'CUTSTRUCT',
      },
      ProjectId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Projects',
          key: 'id',
        },
      },
      RfqRequestId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'RfqRequests',
          key: 'id',
        },
      },
      description: {
        type: Sequelize.STRING,
      },
      timestamp: {
        type: Sequelize.DATE,
      },
      type: {
        type: Sequelize.ENUM('DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'REFUND'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'COMPLETED', 'FAILED'),
      },
      reference: {
        type: Sequelize.STRING,
        defaultValue: `cut${Math.random().toString(35).substring(2, 35)}`,
      },
      CreatedById: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
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
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('UserTransactions');
  },
};
