'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Projects', 'image', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Projects', 'fileName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the new columns and tables
    await queryInterface.removeColumn('Projects', 'image');
    await queryInterface.removeColumn('Projects', 'fileName');
  },
};
