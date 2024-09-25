'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    //rename sponsorId to SponsorId
    queryInterface.renameColumn('Invitations', 'sponsorId', 'SponsorId');
  },

  async down(queryInterface) {
    //rename SponsorId to sponsorId
    queryInterface.renameColumn('Invitations', 'SponsorId', 'sponsorId');
  },
};
