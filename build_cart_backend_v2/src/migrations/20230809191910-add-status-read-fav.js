'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('VendorRfqRequests', 'isSaved', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('RfqRequests', 'isSaved', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('RfqQuotes', 'isSaved', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('VendorRfqRequests', 'isSaved');
    await queryInterface.removeColumn('RfqRequests', 'isSaved');
    await queryInterface.removeColumn('RfqQuotes', 'isSaved');
  },
};
