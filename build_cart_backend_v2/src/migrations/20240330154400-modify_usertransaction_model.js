'use strict';
module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_UserTransactions_paymentProvider" ADD VALUE IF NOT EXISTS \'REMITA\';',
        { transaction: t },
      );
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_UserTransactions_paymentProvider" DROP VALUE IF NOT EXISTS \'REMITA\';',
        { transaction: t },
      );
    });
  },
};
