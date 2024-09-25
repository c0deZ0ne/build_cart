'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'SponsorId', {
      type: Sequelize.UUID,
      references: {
        model: 'Sponsors',
        key: 'id',
        onDelete: 'SET NULL',
      },
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'SponsorId', {
      type: Sequelize.UUID,
      references: {
        model: 'Buyers',
        key: 'id',
        onDelete: 'SET NULL',
      },
      allowNull: true,
    });
  },
};
