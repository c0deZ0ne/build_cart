'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('SharedProjects', 'buyerEmail', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('SharedProjects', 'sponsorEmail', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Payments', 'reciept_url', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Contracts', 'ProjectId', {
      type: Sequelize.UUID,
      references: {
        model: 'Projects',
        key: 'id',
        onDelete: 'SET NULL',
      },
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('SharedProjects', 'buyerEmail');
    await queryInterface.removeColumn('SharedProjects', 'sponsorEmail');
    await queryInterface.removeColumn('Payments', 'reciept_url');
    await queryInterface.removeColumn('Contracts', 'ProjectId');
  },
};
