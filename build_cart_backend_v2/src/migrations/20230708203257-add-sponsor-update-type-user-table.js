'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'SponsorId', {
      type: Sequelize.UUID,
      references: {
        model: 'Sponsors',
        key: 'id',
        onDelete: 'SET NULL',
      },
      allowNull: true,
    });

    await queryInterface.changeColumn('Users', 'type', {
      type: Sequelize.ENUM('VENDOR', 'BUYER', 'ADMIN', 'SPONSOR'),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'SponsorId');

    await queryInterface.changeColumn('Users', 'type', {
      type: Sequelize.ENUM('VENDOR', 'BUYER', 'ADMIN'),
      allowNull: false,
    });
  },
};
