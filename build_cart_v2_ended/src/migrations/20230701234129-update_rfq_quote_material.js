'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('RfqQuoteMaterials', 'quantity', {
      type: Sequelize.INTEGER,
    });

    await queryInterface.changeColumn('RfqQuoteMaterials', 'price', {
      allowNull: false,
      type: Sequelize.INTEGER,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.changeColumn('RfqQuoteMaterials', 'quantity', {
      type: Sequelize.DECIMAL(10, 2),
    });

    await queryInterface.changeColumn('RfqQuoteMaterials', 'price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });
  },
};
