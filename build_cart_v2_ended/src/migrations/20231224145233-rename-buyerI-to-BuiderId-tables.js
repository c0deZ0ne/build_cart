'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get all table names in the database
    const tables = await queryInterface.showAllTables();

    // Iterate over each table
    await Promise.all(
      tables.map(async (table) => {
        // Check if the table has a column named 'BuyerId' or 'buyerId'
        const columns = await queryInterface.describeTable(table);

        if (columns.BuyerId || columns.buyerId) {
          // Determine the current column name
          const currentColumnName = columns.BuyerId ? 'BuyerId' : 'buyerId';

          // Create a new column name
          const newColumnName = 'BuilderId';

          // Rename the column
          await queryInterface.renameColumn(
            table,
            currentColumnName,
            newColumnName,
          );
        }
      }),
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the changes
    // This assumes you have a consistent naming convention for the column before renaming
    const tables = await queryInterface.showAllTables();

    await Promise.all(
      tables.map(async (table) => {
        // Check if the table has a column named 'BuilderId'
        const columns = await queryInterface.describeTable(table);

        if (columns.BuilderId) {
          // Determine the current column name
          const currentColumnName = 'BuilderId';

          // Create a new column name
          const newColumnName = columns.BuilderId.toLowerCase(); // Revert to original case

          // Rename the column back to the original name
          await queryInterface.renameColumn(
            table,
            currentColumnName,
            newColumnName,
          );
        }
      }),
    );
  },
};
