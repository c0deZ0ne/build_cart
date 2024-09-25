'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('BuilderFundManagers', 'ProjectId', {
      type: Sequelize.UUID, // Adjust the data type if needed
      allowNull: true,
      references: {
        model: 'Projects', // Adjust to match your actual table name
        key: 'id', // Update with the correct column name if needed
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('BuilderFundManagers', 'ProjectId');
  },
};
