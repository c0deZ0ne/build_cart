'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_Projects_status" ADD VALUE IF NOT EXISTS \'APPROVED\';',
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_Projects_status" DROP VALUE IF EXISTS \'APPROVED\';',
    );
  },
};
