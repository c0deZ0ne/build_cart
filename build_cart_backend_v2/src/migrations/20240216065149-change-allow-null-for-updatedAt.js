'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('UserLogs', 'updatedAt', {
      allowNull: true,
      type: Sequelize.DATE,
    });
    await queryInterface.changeColumn('UserLogs', 'deletedAt', {
      allowNull: true,
      type: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('UserLogs', 'updatedAt', {
      allowNull: false,
      type: Sequelize.DATE,
    });
    await queryInterface.changeColumn('UserLogs', 'deletedAt', {
      allowNull: false,
      type: Sequelize.DATE,
    });
  },
};
