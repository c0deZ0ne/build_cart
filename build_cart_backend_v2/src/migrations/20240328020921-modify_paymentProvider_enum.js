'use strict';
module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_Payments_paymentProvider" ADD VALUE IF NOT EXISTS \'PAYSTACK\';',
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_Payments_paymentProvider" ADD VALUE IF NOT EXISTS \'REMITA\';',
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_Payments_paymentProvider" ADD VALUE IF NOT EXISTS \'BANK_TRANSFER\';',
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_Payments_paymentProvider" ADD VALUE IF NOT EXISTS \'CUTSTRUCT_PAY\';',
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_Payments_paymentProvider" ADD VALUE IF NOT EXISTS \'BANI\';',
        { transaction: t },
      );
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_Payments_paymentProvider" DROP VALUE IF NOT EXISTS \'PAYSTACK\';',
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_Payments_paymentProvider" DROP VALUE IF NOT EXISTS \'REMITA\';',
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_Payments_paymentProvider" DROP VALUE IF NOT EXISTS \'CUTSTRUCT_PAY\';',
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_Payments_paymentProvider" DROP VALUE IF NOT EXISTS \'BANK_TRANSFER\';',
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_Payments_paymentProvider" DROP VALUE IF NOT EXISTS \'BANI\';',
        { transaction: t },
      );

    });
  },
};