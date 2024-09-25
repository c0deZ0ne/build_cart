'use strict';

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_RfqRequests_paymentTerm" ADD VALUE IF NOT EXISTS \'PAY_ON_DELIVERY\';',
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_RfqRequests_paymentTerm" DROP VALUE \'PAY_ON_DELIVERY\';',
    );
  },
};
