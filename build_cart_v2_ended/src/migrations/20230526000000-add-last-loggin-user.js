'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'lastLogin', {
      allowNull: true,
      type: Sequelize.DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'lastLogin');
  },
};
