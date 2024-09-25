'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('RfqRequests', 'category', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('RfqRequests', 'totalBudget', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    await queryInterface.addColumn('RfqRequestMaterials', 'name', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('RfqRequestMaterials', 'metric', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('RfqQuotes', 'totalCost', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    await queryInterface.addColumn('RfqQuoteMaterials', 'quantity', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('RfqRequests', 'category');
    await queryInterface.removeColumn('RfqRequests', 'totalBudget');
    await queryInterface.removeColumn('RfqRequestMaterials', 'name');
    await queryInterface.removeColumn('RfqRequestMaterials', 'metric');
    await queryInterface.removeColumn('RfqQuotes', 'totalCost');
    await queryInterface.removeColumn('RfqQuoteMaterials', 'quantity');
  },
};
