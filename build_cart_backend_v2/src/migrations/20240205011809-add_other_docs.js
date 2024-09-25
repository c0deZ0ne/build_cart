'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Builders', 'other_docs', {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Vendors', 'other_docs', {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('FundManagers', 'other_docs', {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Builders', 'other_docs');
    await queryInterface.removeColumn('Vendors', 'other_docs');
    await queryInterface.removeColumn('FundManagers', 'other_docs');
  },
};
