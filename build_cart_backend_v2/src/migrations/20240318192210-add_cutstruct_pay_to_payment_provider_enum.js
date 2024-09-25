'use strict';

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_UserTransactions_paymentProvider" ADD VALUE IF NOT EXISTS \'CUTSTRUCT_PAY\';',
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_ProjectTransactions_paymentProvider" ADD VALUE IF NOT EXISTS \'CUTSTRUCT_PAY\';',
        { transaction: t },
      );
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_ProjectTransactions_paymentProvider" DROP VALUE IF NOT EXISTS \'CUTSTRUCT_PAY\';',
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_UserTransactions_paymentProvider" DROP VALUE IF NOT EXISTS \'CUTSTRUCT_PAY\';',
        { transaction: t },
      );
    });
  },
};