'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Vendors', 'lastLogin', {
      allowNull: true,
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn('Buyers', 'lastLogin', {
      allowNull: true,
      type: Sequelize.DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Vendors', 'lastLogin');
    await queryInterface.removeColumn('Buyers', 'lastLogin');
  },
};
