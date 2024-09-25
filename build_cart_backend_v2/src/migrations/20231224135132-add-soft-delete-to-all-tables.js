'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get all table names in the database
    const tables = await queryInterface.showAllTables();

    // Add the `deletedAt` column to each table
    await Promise.all(
      tables.map(async (table) => {
        await queryInterface.addColumn(table, 'deletedAt', {
          type: Sequelize.DATE,
          allowNull: true,
        });
      }),
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the `deletedAt` column from each table
    const tables = await queryInterface.showAllTables();

    await Promise.all(
      tables.map(async (table) => {
        await queryInterface.removeColumn(table, 'deletedAt');
      }),
    );
  },
};
