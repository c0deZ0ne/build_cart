'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
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
          'UPCOMMING',
        ),
        defaultValue: 'PENDING',
        allowNull: false,
      },
      rfqRequestMaterialId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'RfqRequestMaterials',
          key: 'id',
        },
      },
      VendorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Vendors',
          key: 'id',
        },
      },
      BuyerId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Buyers',
          key: 'id',
        },
      },
      SponsorId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Sponsors',
          key: 'id',
        },
      },
      RfqQuoteId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'RfqQuotes',
          key: 'id',
        },
      },
      RfqRequestId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'RfqRequests',
          key: 'id',
        },
      },
      ProjectId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Projects',
          key: 'id',
        },
      },
      CreatedById: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      UpdatedById: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      paidAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      acceptedAt: {
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
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('Orders', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Orders');
  },
};
