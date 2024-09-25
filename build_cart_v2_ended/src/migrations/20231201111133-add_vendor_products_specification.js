'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VendorProductSpecifications', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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

    await queryInterface.createTable('VendorProductSpecificationProducts', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      product_spec: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vendorProductId: {
        type: Sequelize.UUID,
        references: {
          model: 'VendorProducts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      vendorProductSpecificationId: {
        type: Sequelize.UUID,
        references: {
          model: 'VendorProductSpecifications',
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

    await queryInterface.addColumn(
      'RetailTransactions',
      'vendorProductSpecificationProductID',
      {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'VendorProductSpecificationProducts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      'RetailTransactions',
      'vendorProductSpecificationProductID',
    );
    await queryInterface.dropTable('VendorProductSpecificationProducts');
    await queryInterface.dropTable('VendorProductSpecifications');
  },
};
