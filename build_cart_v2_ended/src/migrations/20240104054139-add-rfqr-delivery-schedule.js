'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the deliverySchedule column
    await queryInterface.addColumn('RfqRequests', 'deliverySchedule', {
      type: Sequelize.JSONB,
      allowNull: true,
    });

    return Promise.resolve();
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('RfqRequests', 'deliverySchedule');

    // Return a promise that resolves when the migration is complete
    return Promise.resolve();
  },
};
