'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Buyers', 'creditStatus', {
      type: Sequelize.ENUM('DISABLED', 'APPROVED'),
      allowNull: true,
      defaultValue: 'DISABLED',
    });
    await queryInterface.addColumn('Buyers', 'country', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Buyers', 'state', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Buyers', 'location', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Buyers', 'longitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
    });

    await queryInterface.addColumn('Buyers', 'latitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Buyers', 'creditStatus', {
      type: Sequelize.ENUM('DISABLED', 'APPROVED'),
      allowNull: true,
      defaultValue: 'DISABLED',
      cascade: true,
    });

    await queryInterface.removeColumn('Buyers', 'location');
    await queryInterface.removeColumn('Buyers', 'country');
    await queryInterface.removeColumn('Buyers', 'state');
    await queryInterface.removeColumn('Buyers', 'longitude');
    await queryInterface.removeColumn('Buyers', 'latitude');
  },
};
