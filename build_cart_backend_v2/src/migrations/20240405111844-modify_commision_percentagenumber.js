'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Commissions', 'percentageNumber', {
      allowNull: true,
      type: Sequelize.INTEGER,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Commissions', 'percentageNumber', {
      allowNull: true,
      type: Sequelize.INTEGER,
    });
  },
};
