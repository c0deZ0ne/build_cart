'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the new enum column

    await queryInterface.addColumn('RfqRequestMaterials', 'status', {
      type: Sequelize.DataTypes.ENUM('ONGOING', 'REOPENED', 'ClOSED'),
      allowNull: false,
      defaultValue: 'ONGOING',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the enum column
    await queryInterface.removeColumn('RfqRequestMaterials', 'status');
  },
};
