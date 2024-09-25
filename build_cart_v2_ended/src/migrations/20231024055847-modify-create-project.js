'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Projects', 'longitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
    });

    await queryInterface.addColumn('Projects', 'latitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
    });

    await queryInterface.addColumn('Projects', 'location', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Projects', 'startDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('Projects', 'endDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the new columns and tables
    await queryInterface.removeColumn('Projects', 'longitude');
    await queryInterface.removeColumn('Projects', 'latitude');
    await queryInterface.removeColumn('Projects', 'location');
    await queryInterface.removeColumn('Projects', 'startDate');
    await queryInterface.removeColumn('Projects', 'endDate');
  },
};
