'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add 'REMITA' to the existing enum values
    // await queryInterface.sequelize.query(`
    //   ALTER TYPE "enum_UserTransactions_PaymentProvider"
    //   ADD VALUE 'REMITA';
    // `);

    // Add the 'store' column
    await queryInterface.addColumn('UserTransactions', 'meta', {
      type: Sequelize.JSONB,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove 'REMITA' from the enum
    // await queryInterface.sequelize.query(`
    //   ALTER TYPE "enum_UserTransactions_PaymentProvider"
    //   DROP VALUE 'REMITA';
    // `);

    // Remove the 'store' column
    await queryInterface.removeColumn('UserTransactions', 'meta');
  },
};
