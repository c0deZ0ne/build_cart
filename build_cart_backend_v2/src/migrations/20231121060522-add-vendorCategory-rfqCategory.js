'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the VendorRfqCategories table
    await queryInterface.createTable('VendorRfqCategories', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      VendorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Vendors', // Update with your actual table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      RfqCategoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'RfqCategories', // Update with your actual table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

    // Add a unique constraint to prevent duplicate entries
    await queryInterface.addConstraint('VendorRfqCategories', {
      fields: ['VendorId', 'RfqCategoryId'],
      type: 'unique',
      name: 'unique_vendor_rfq_category',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the VendorRfqCategories table
    await queryInterface.dropTable('VendorRfqCategories');
  },
};
