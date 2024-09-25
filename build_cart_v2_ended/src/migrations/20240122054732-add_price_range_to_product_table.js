'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Products', 'price_range', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.sequelize.query(
      `UPDATE "Products" SET "price_range" = '3500 - 5000' WHERE "price_range" IS NULL`,
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Products', 'price_range');
  },
};
