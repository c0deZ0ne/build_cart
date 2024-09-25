// In the migration file (create_payments_table.js)
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID, // Change this to UUID if needed
      },
      CreatedById: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      UpdatedById: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      ContractId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Contracts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      // orderId: {
      //   type: Sequelize.UUID,
      //   allowNull: true,
      //   references: {
      //     model: 'Orders',
      //     key: 'id',
      //   },
      //   onUpdate: 'CASCADE',
      //   onDelete: 'SET NULL',
      // },
      pay_ref: {
        type: Sequelize.STRING,
      },
      pay_ext_ref: {
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING,
      },
      vend_token: {
        type: Sequelize.UUID,
      },
      order_details: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      pay_amount_collected: {
        type: Sequelize.DECIMAL(15, 2),
      },
      pay_amount: {
        type: Sequelize.DECIMAL(15, 2),
      },
      pay_status: {
        type: Sequelize.ENUM('SUCCESS', 'FAILED', 'PENDING'),
        allowNull: false,
      },
      pay_amount_outstanding: {
        type: Sequelize.DECIMAL(15, 2),
      },
      match_amount: {
        type: Sequelize.DECIMAL(15, 2),
      },
      pub_date: {
        type: Sequelize.STRING,
      },
      modified_date: {
        type: Sequelize.STRING,
      },
      match_currency: {
        type: Sequelize.STRING,
      },
      RfqRequestId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'RfqRequests',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      RfqRequestMaterialId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'RfqRequestMaterials',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      ProjectId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Projects',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      custom_data: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      paymentProvider: {
        type: Sequelize.ENUM(
          'BANI',
          'PAYSTACK',
          'REMITTER',
          'BANK_TRANSFER',
          'CUTSTRUCT_PAY',
        ),
        allowNull: false,
      },
      receipt_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      migratedAt: {
        type: Sequelize.DATE,
        allowNull: true,
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Payments');
  },
};
