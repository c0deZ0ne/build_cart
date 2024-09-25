'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new columns with the desired data types
    await queryInterface.addColumn('Payments', 'pay_amount_collected_new', {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
    });

    await queryInterface.addColumn('Payments', 'pay_amount_outstanding_new', {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
    });

    await queryInterface.addColumn('Payments', 'merch_amount_new', {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
    });

    // Update the new columns with converted values from the old columns
    await queryInterface.sequelize.query(
      'UPDATE "Payments" SET "pay_amount_collected_new" = CAST("pay_amount_collected" AS DECIMAL(15, 2))',
    );

    await queryInterface.sequelize.query(
      'UPDATE "Payments" SET "pay_amount_outstanding_new" = CAST("pay_amount_outstanding" AS DECIMAL(15, 2))',
    );

    await queryInterface.sequelize.query(
      'UPDATE "Payments" SET "merch_amount_new" = CAST("merch_amount" AS DECIMAL(15, 2))',
    );

    // Remove the old columns
    await queryInterface.removeColumn('Payments', 'pay_amount_collected');
    await queryInterface.removeColumn('Payments', 'pay_amount_outstanding');
    await queryInterface.removeColumn('Payments', 'merch_amount');

    // Rename the new columns to match the original names
    await queryInterface.renameColumn(
      'Payments',
      'pay_amount_collected_new',
      'pay_amount_collected',
    );

    await queryInterface.renameColumn(
      'Payments',
      'pay_amount_outstanding_new',
      'pay_amount_outstanding',
    );

    await queryInterface.renameColumn(
      'Payments',
      'merch_amount_new',
      'merch_amount',
    );
  },

  down: async () => {
    // Revert changes if necessary, e.g., creating the original columns again
  },
};
