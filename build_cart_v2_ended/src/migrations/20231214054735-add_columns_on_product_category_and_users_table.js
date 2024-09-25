'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ProductCategories', 'image_url', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Products', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('Products', 'is_todays_pick', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addColumn('Products', 'top_selling_item', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('ProductCategories', 'image_url');
    await queryInterface.removeColumn('Products', 'description');
    await queryInterface.removeColumn('Products', 'is_todays_pick');
    await queryInterface.removeColumn('Products', 'top_selling_item');
  },
};
