'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('RetailTransactions', 'duration_unit', {
      type: Sequelize.ENUM('DAYS', 'WEEKS', 'MONTHS'),
      allowNull: true,
    });

    await queryInterface.addColumn('RetailTransactions', 'quantity', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('RetailTransactions', 'duration', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('RetailTransactions', 'transaction_no', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('RetailTransactions', 'status', {
      type: Sequelize.ENUM('PENDING', 'COMPLETE', 'FAILED'),
      allowNull: false,
      defaultValue: 'PENDING',
    });

    await queryInterface.addColumn('RetailTransactions', 'transaction_type', {
      type: Sequelize.ENUM('SERVICE', 'PRODUCT'),
      allowNull: true,
    });

    await queryInterface.addColumn('Products', 'image_url', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('LabourHacks', 'image_url', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('LabourHacks', 'image_url');
    await queryInterface.removeColumn('Products', 'image_url');
    await queryInterface.removeColumn('RetailTransactions', 'transaction_type');
    await queryInterface.removeColumn('RetailTransactions', 'status');
    await queryInterface.removeColumn('RetailTransactions', 'transaction_no');
    await queryInterface.removeColumn('RetailTransactions', 'duration');
    await queryInterface.removeColumn('RetailTransactions', 'quantity');
    await queryInterface.removeColumn('RetailTransactions', 'duration_unit');
  },
};
