'use strict';

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_TenderBids_status" ADD VALUE IF NOT EXISTS \'IN_REVIEW\';',
    );
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_TenderBids_status" ADD VALUE IF NOT EXISTS \'CLOSED\';',
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_TenderBids_status" DROP VALUE \'IN_REVIEW\';',
    );
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_TenderBids_status" DROP VALUE \'CLOSED\';',
    );
  },
};
