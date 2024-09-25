'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('Projects', 'SponsorId', {
      type: Sequelize.UUID,
      references: {
        model: 'Sponsors',
        key: 'id',
      },

      allowNull: true,
    });

    queryInterface.changeColumn('Projects', 'BuyerId', {
      type: Sequelize.UUID,
      constriants: false,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('Projects', 'SponsorId');
    queryInterface.changeColumn('Projects', 'BuyerId', {
      type: Sequelize.UUID,
      constriants: true,
      allowNull: false,
    });
  },
};
