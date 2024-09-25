'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Invitations', 'sponsorId', {
      type: Sequelize.UUID,
      references: {
        model: 'Sponsors',
        key: 'id',
        onDelete: 'SET NULL',
      },
      allowNull: true,
    });
  },

  async down(queryInterface) {
    //remove sponsorId column
    await queryInterface.removeColumn('Invitations', 'sponsorId');
  },
};
