'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('RfqQuotes', 'totalCost', {
      type: Sequelize.DECIMAL(100, 2),
      allowNull: true,
    });
    await queryInterface.changeColumn('RfqRequests', 'totalBudget', {
      type: Sequelize.DECIMAL(100, 2),
      allowNull: true,
    });
    await queryInterface.changeColumn('Contracts', 'totalCost', {
      allowNull: true,
      type: Sequelize.DECIMAL(100, 2),
    });
  },

  down: async (queryInterface) => {
    await queryInterface.changeColumn('RfqQuotes', 'totalCost', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });
    await queryInterface.changeColumn('RfqRequests', 'totalBudget', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });
    await queryInterface.changeColumn('Contracts', 'totalCost', {
      allowNull: true,
      type: Sequelize.DECIMAL(10, 2),
    });
  },
};
