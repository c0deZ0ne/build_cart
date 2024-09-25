'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ProductCategories', 'product_visibility', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    });

    await queryInterface.addColumn('Products', 'product_visibility', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn(
      'ProductCategories',
      'product_visibility',
    );
    await queryInterface.removeColumn('Products', 'product_visibility');
  },
};
