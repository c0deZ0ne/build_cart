'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ProjectTransactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      ProjectWalletId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'ProjectWallets', // Update with the actual table name
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      walletId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'UserWallets',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      amount: {
        allowNull: false,
        type: Sequelize.DECIMAL(15, 2),
      },
      ProjectId: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: 'Projects', // Update with your actual project model name
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      timestamp: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'REFUND'),
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('PENDING', 'COMPLETED', 'FAILED'),
        defaultValue: 'PENDING',
      },
      fee: {
        allowNull: true,
        type: Sequelize.DECIMAL(10, 2),
      },
      paymentMethod: {
        allowNull: false,
        type: Sequelize.ENUM(
          'BANK_TRANSFER',
          'CREDIT_CARD',
          'BANK_USSD',
          'MOBILE_MONEY',
          'CUTSTRUCT_PAY',
        ),
        defaultValue: 'CUTSTRUCT_PAY',
      },

      paymentProvider: {
        allowNull: false,
        type: Sequelize.ENUM(
          'PAYSTACK',
          'FLUTTERWAVE',
          'BANI',
          'CUTSTRUCT',
          'PAYPAL',
        ),
        defaultValue: 'CUTSTRUCT',
      },
      ItemTypes: {
        allowNull: false,
        type: Sequelize.ENUM('RFQ_REQUEST'),
        defaultValue: 'RFQ_REQUEST',
      },
      reference: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      CreatedById: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: 'Users', // Update with your actual user model name
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
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
    await queryInterface.dropTable('ProjectTransactions');
  },
};
