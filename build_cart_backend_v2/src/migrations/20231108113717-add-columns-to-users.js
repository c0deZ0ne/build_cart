'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'phoneNumber', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'location', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'tier', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'acceptTerms', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'longitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'latitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Users', 'phoneNumber'),
      queryInterface.removeColumn('Users', 'location'),
      queryInterface.removeColumn('Users', 'tier'),
      queryInterface.removeColumn('Users', 'acceptTerms'),
      queryInterface.removeColumn('Users', 'longitude'),
      queryInterface.removeColumn('Users', 'latitude'),
    ]);
  },
};
