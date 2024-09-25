'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the new enum column

    await queryInterface.addColumn('Vendors', 'VendorType', {
      type: Sequelize.DataTypes.ENUM('MANUFACTURER', 'DISTRIBUTOR'),
      allowNull: true,
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Vendors', 'VendorType');
  },
};
