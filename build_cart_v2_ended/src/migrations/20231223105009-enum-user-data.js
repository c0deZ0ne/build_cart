'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'businessName', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.removeColumn('Users', 'type');
    await queryInterface.removeColumn('Users', 'tier');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'businessName');
  },
};
