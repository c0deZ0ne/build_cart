// Example: 20220127123456-update-chats-for-fundmanager.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Update VendorId and BuilderId columns to allow null
    await queryInterface.changeColumn('Chats', 'VendorId', {
      allowNull: true,
      type: Sequelize.UUID,
    });

    await queryInterface.changeColumn('Chats', 'BuilderId', {
      allowNull: true,
      type: Sequelize.UUID,
    });

    // Add FundManagerId column to Chats table
    await queryInterface.addColumn('Chats', 'FundManagerId', {
      allowNull: true,
      type: Sequelize.UUID,
      references: {
        model: 'FundManagers',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });

    // Remove the existing unique index
    await queryInterface.removeIndex('Chats', 'unique_builder_vendor_index');

    // Add a new unique index with FundManagerId
    await queryInterface.addIndex(
      'Chats',
      ['VendorId', 'BuilderId', 'FundManagerId'],
      {
        unique: true,
        name: 'unique_vendor_builder_fundmanager_index',
      },
    );
  },

  down: async (queryInterface) => {
    // Remove the new unique index
    await queryInterface.removeIndex(
      'Chats',
      'unique_vendor_builder_fundmanager_index',
    );

    // Add back the original unique index
    await queryInterface.addIndex('Chats', ['VendorId', 'BuilderId'], {
      unique: true,
      name: 'unique_builder_vendor_index',
    });

    // Remove the FundManagerId column
    await queryInterface.removeColumn('Chats', 'FundManagerId');

    // Update VendorId and BuilderId columns to disallow null (adjust types as needed)
    await queryInterface.changeColumn('Chats', 'VendorId', {
      allowNull: false,
      type: Sequelize.UUID,
    });

    await queryInterface.changeColumn('Chats', 'BuilderId', {
      allowNull: false,
      type: Sequelize.UUID,
    });
  },
};
