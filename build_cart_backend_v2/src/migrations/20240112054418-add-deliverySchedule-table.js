'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DeliverySchedules', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      status: {
        type: Sequelize.ENUM(
          'PENDING',
          'PAID',
          'COMPLETED',
          'ONGOING',
          'UPCOMING',
        ),
        defaultValue: 'PENDING',
        allowNull: false,
      },
      quantity: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      dueDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      paymentTerm: {
        type: Sequelize.ENUM('ESCROW', 'CREDIT', 'BNPL', 'PAY_ON_DELIVERY'),
        defaultValue: 'ESCROW',
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      rfqRequestMaterialId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'RfqRequestMaterials',
          key: 'id',
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION',
      },
      orderId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      VendorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Vendors',
          key: 'id',
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL',
      },
      BuilderId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Builders',
          key: 'id',
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION',
      },
      FundManagerId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'FundManagers',
          key: 'id',
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL',
      },
      RfqQuoteId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'RfqQuotes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      RfqRequestId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'RfqRequests',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ProjectId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Projects',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      CreatedById: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'NO ACTION',
        onDelete: 'SET NULL',
      },
      UpdatedById: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL',
      },
      paidAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      completed: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      migratedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('DeliverySchedules');
  },
};
