'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RfqRequestInvitations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
      VendorId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Vendors',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

    await queryInterface.addIndex(
      'RfqRequestInvitations',
      ['VendorId', 'RfqRequestId'],
      {
        unique: true,
        name: 'rfq_request_invitations_vendor_id_rfq_request_id_unique',
      },
    );

    await queryInterface.createTable('RfqQuotes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
      deliveryDate: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('ACCEPTED', 'PENDING', 'REJECTED', 'CANCELLED'),
        defaultValue: 'PENDING',
      },
      tax: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      logisticCost: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      lpo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      additionalNote: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      CreatedById: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      UpdatedById: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'SET NULL',
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

    await queryInterface.createTable('RfqQuoteMaterials', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      RfqRequestMaterialId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'RfqRequestMaterials',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      RfqRequestId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'RfqRequests',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      RfqQuoteId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'RfqQuotes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      price: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2),
      },
      discount: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      CreatedById: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      UpdatedById: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'SET NULL',
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

    await queryInterface.createTable('VendorRfqRequests', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      VendorId: {
        type: Sequelize.UUID,
        references: {
          model: 'Vendors',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      RfqRequestId: {
        type: Sequelize.UUID,
        references: {
          model: 'RfqRequests',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
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
    await queryInterface.dropTable('VendorRfqRequests');
    await queryInterface.dropTable('RfqQuoteMaterials');
    await queryInterface.dropTable('RfqQuotes');
    await queryInterface.dropTable('RfqRequestInvitations');
  },
};
