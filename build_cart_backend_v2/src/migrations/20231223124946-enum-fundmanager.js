'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      'FundManagers',
      'address',
      'businessAddress',
    );
    await queryInterface.removeColumn('FundManagers', 'country');
    await queryInterface.removeColumn('FundManagers', 'location');
    await queryInterface.removeColumn('FundManagers', 'name');
    await queryInterface.removeColumn('FundManagers', 'registrationNumber');

    await queryInterface.addColumn('FundManagers', 'businessSize', {
      type: Sequelize.DataTypes.ENUM('MICRO', 'SMALL', 'MEDIUM', 'LARGE'),
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('FundManagers', 'businessRegNo', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('FundManagers', 'businessName', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      'FundManagers',
      'businessAddress',
      'address',
    );

    await queryInterface.addColumn('FundManagers', 'registrationNumber', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.removeColumn('FundManagers', 'businessSize');
    await queryInterface.removeColumn('FundManagers', 'businessAddress');
    await queryInterface.removeColumn('FundManagers', 'businessName');
  },
};
