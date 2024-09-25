'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Invitations', 'buyerName', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.renameColumn('Invitations', 'name', 'sponsorName');
    await queryInterface.removeColumn('Invitations', 'status');
    await queryInterface.renameColumn(
      'Invitations',
      'recipientEmail',
      'buyerEmail',
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Invitations', {
      status: {
        allowNull: false,
        defaultValue: 'PENDING',
        type: Sequelize.ENUM('PENDING', 'ACCEPT', 'DECLINE'),
      },
    });

    await queryInterface.removeColumn('Invitations', 'buyerName');

    await queryInterface.renameColumn('Invitations', 'sponsorName', 'name');
    await queryInterface.renameColumn(
      'Invitations',
      'buyerEmail',
      'recipientEmail',
    );
  },
};
