'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     */
    await queryInterface.renameColumn(
      'Invitations',
      'sponsorName',
      'fundManagerName',
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     */
    await queryInterface.renameColumn(
      'Invitations',
      'fundManagerName',
      'sponsorName',
    );
  },
};

// "sponsorName" character varying(255) COLLATE pg_catalog."default",
