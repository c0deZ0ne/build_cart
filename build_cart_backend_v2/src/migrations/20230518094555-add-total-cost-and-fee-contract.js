'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Contracts', 'totalCost', {
      allowNull: true,
      type: Sequelize.DECIMAL(10, 2),
    });
    await queryInterface.addColumn('Contracts', 'fee', {
      allowNull: false,
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0.0,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Contracts', 'totalCost');
    await queryInterface.removeColumn('Contracts', 'fee');
  },
};
