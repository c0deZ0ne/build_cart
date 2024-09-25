'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('SharedProjects', 'SponsorId', {
      allowNull: true,
      type: Sequelize.UUID,
      references: {
        model: 'Sponsors', // Replace 'Sponsors' with the actual table name for the 'Sponsor' model
        key: 'id', // Replace 'id' with the actual primary key field for the 'Sponsor' model
      },
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('SharedProjects', 'BuyerId', {
      allowNull: true,
      type: Sequelize.UUID,
      references: {
        model: 'Buyers', // Replace 'Buyers' with the actual table name for the 'Buyer' model
        key: 'id', // Replace 'id' with the actual primary key field for the 'Buyer' model
      },
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('SharedProjects', 'SponsorId');
    await queryInterface.removeColumn('SharedProjects', 'BuyerId');
  },
};
