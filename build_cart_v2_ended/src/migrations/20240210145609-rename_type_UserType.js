'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'ProjectTransactions',
      'type',
      'userType',
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'ProjectTransactions',
      'userType',
      'type',
    );
  },
};
