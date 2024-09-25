'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('RfqQuotes', 'isStarred', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });

    await queryInterface.addColumn('RfqQuotes', 'isRead', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });

    await queryInterface.addColumn('RfqQuotes', 'isArchived', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('RfqQuotes', 'isStarred');
    await queryInterface.removeColumn('RfqQuotes', 'isRead');
    await queryInterface.removeColumn('RfqQuotes', 'isArchived');
  },
};
