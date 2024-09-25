'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('RfqItems', 'category', {
      allowNull: false,
      type: Sequelize.STRING,
      defaultValue: 'category',
    });
    await queryInterface.addColumn('RfqItems', 'carbonCount', {
      allowNull: false,
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0.0,
    });
    await queryInterface.dropTable('RfqItemCategories');
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('RfqItems', 'category');
    await queryInterface.removeColumn('RfqItems', 'carbonCount');
  },
};
