'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('RfqRequests', 'deliveryInstructions', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.changeColumn('RfqRequests', 'deliveryInstructions', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
