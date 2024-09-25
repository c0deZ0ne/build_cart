'use strict';


module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_UserTransactions_paymentPurpose" ADD VALUE IF NOT EXISTS \'RFQ_REQUEST\';',
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_UserTransactions_paymentPurpose" ADD VALUE IF NOT EXISTS \'FUND_PROJECT_WALLET\';',
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_UserTransactions_paymentPurpose" ADD VALUE IF NOT EXISTS \'FUND_ORDER\';',
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_UserTransactions_paymentPurpose" ADD VALUE IF NOT EXISTS \'PLATFORM_SUBSCRIPTION\';',
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_UserTransactions_paymentPurpose" ADD VALUE IF NOT EXISTS \'FUND_WALLET\';',
        { transaction: t },
      );
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_UserTransactions_paymentPurpose" DROP VALUE IF NOT EXISTS \'RFQ_REQUEST\';',
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_UserTransactions_paymentPurpose" DROP VALUE IF NOT EXISTS \'FUND_PROJECT_WALLET\';',
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_UserTransactions_paymentPurpose" DROP VALUE IF NOT EXISTS \'PLATFORM_SUBSCRIPTION\';',
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_UserTransactions_paymentPurpose" DROP VALUE IF NOT EXISTS \'FUND_ORDER\';',
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_UserTransactions_paymentPurpose" DROP VALUE IF NOT EXISTS \'FUND_WALLET\';',
        { transaction: t },
      );

    });
  },
};