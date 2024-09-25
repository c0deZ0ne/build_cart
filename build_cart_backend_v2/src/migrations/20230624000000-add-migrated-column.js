'use strict';

const tables = [
  'Vendors',
  'Buyers',
  'Users',
  'Projects',
  'Tickets',
  'Documents',
  'RfqItems',
  'RfqQuotes',
  'RfqRequests',
  'Contracts',
  'Banks',
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    for (const table of tables) {
      await queryInterface.addColumn(table, 'migratedAt', {
        allowNull: true,
        type: Sequelize.DATE,
      });
    }
  },

  down: async (queryInterface) => {
    for (const table of tables) {
      await queryInterface.removeColumn(table, 'migratedAt');
    }
  },
};
