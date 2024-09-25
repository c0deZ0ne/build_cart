'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get all table names in the database
    const tables = await queryInterface.showAllTables();

    // Iterate over each table
    await Promise.all(
      tables.map(async (table) => {
        // Check if the table has a column named 'SponsorId' or 'sponsorId'
        const columns = await queryInterface.describeTable(table);

        if (columns.sponsorId || columns.SponsorId) {
          // Determine the current column name
          const currentColumnName = columns.sponsorId
            ? 'sponsorId'
            : 'SponsorId';

          // Create a new column name
          const newColumnName = 'FundManagerId';

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
        // Check if the table has a column named 'FundManagerId'
        const columns = await queryInterface.describeTable(table);

        if (columns.FundManagerId) {
          // Determine the current column name
          const currentColumnName = 'FundManagerId';

          // Create a new column name
          const newColumnName = 'SponsorId'; // Revert to the original case

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
