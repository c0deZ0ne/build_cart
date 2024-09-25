'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the new enum column

    await queryInterface.addColumn('Users', 'userType', {
      type: Sequelize.DataTypes.ENUM(
        'ADMIN',
        'SUPER_ADMIN',
        'BUILDER',
        'FUND_MANAGER',
        'VENDOR',
      ),
      allowNull: true,
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'userType');
  },
};
