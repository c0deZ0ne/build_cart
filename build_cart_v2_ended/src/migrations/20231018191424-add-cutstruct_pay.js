'use strict';

/** @type {import('sequelize-cli').Migration} */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_Payments_paymentProvider" ADD VALUE 'CUTSTRUCT_PAY';`,
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_Payments_paymentProvider" DROP VALUE 'CUTSTRUCT_PAY';`,
    );
  },
};
