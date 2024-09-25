'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RateReviewVendors', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
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
      ContractId: {
        allowNull: false,
        type: Sequelize.UUID,
        unique: true,
        references: {
          model: 'Contracts',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      onTimeDelivery: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      defectControl: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      effectiveCommunication: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      specificationAccuracy: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      review: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      deliveryPictures: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
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
    await queryInterface.dropTable('RateReviewVendors');
  },
};
