'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'ProjectTransactions', // Table name
      'paymentPurpose', // Column name
      {
        type: Sequelize.ENUM(
          'RFQ_REQUEST',
          'FUND_PROJECT_WALLET',
          'FUND_WALLET',
          'FUND_ORDER',
        ),
        allowNull: true,
      },
    );

    await queryInterface.addColumn(
      'UserTransactions', // Table name
      'paymentPurpose', // Column name
      {
        type: Sequelize.ENUM('RFQ_REQUEST', 'PROJECT', 'WALLET'),
        allowNull: true,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'ProjectTransactions', // Table name
      'paymentPurpose', // Column name
      {
        type: Sequelize.ENUM(
          'RFQ_REQUEST',
          'FUND_PROJECT_WALLET',
          'VENDOR',
          'FUND_ORDER',
        ),
        allowNull: true,
      },
      { transaction },
    );

    await queryInterface.removeColumn(
      'UserTransactions', // Table name
      'paymentPurpose', // Column name
      {
        type: Sequelize.ENUM('RFQ_REQUEST', 'PROJECT', 'WALLET'),
        allowNull: true,
      },
    );
    await queryInterface.removeColumn('ProjectTransactions', 'ItemTypes');
  },
};
