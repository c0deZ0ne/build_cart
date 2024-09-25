'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'SharedProjects',
      'sponsorEmail',
      'fundManagerEmail',
    );
    await queryInterface.renameColumn(
      'SharedProjects',
      'MySponsorId',
      'MyFundManagerId',
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'SharedProjects',
      'fundManagerEmail',
      'sponsorEmail',
    );
    await queryInterface.renameColumn(
      'SharedProjects',
      'MyFundManagerId',
      'MySponsorId',
    );
  },
};
