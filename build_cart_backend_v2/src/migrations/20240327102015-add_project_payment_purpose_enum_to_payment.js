'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Payments', 'paymentPurpose', {
      type: Sequelize.ENUM,
      values: [
        'RFQ_REQUEST',
        'FUND_PROJECT_WALLET',
        'FUND_WALLET',
        'FUND_ORDER',
        'PLATFORM_SUBSCRIPTION',
      ],
      defaultValue: 'RFQ_REQUEST',
    });
    await queryInterface.addColumn('Payments', 'paymentMethod', {
      type: Sequelize.ENUM,
      values: [
        'BANK_TRANSFER',
        'CREDIT_CARD',
        'BANK_USSD',
        'MOBILE_MONEY',
        'CUTSTRUCT_PAY',
      ],
      defaultValue: 'BANK_TRANSFER',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Payments', 'paymentPurpose');
    await queryInterface.removeColumn('Payments', 'paymentMethod');
  }
};
