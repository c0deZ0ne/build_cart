'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('ProjectTransactions', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.changeColumn('ProjectTransactions', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    });

    await queryInterface.changeColumn('ProjectTransactions', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('ProjectTransactions', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.changeColumn('ProjectTransactions', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    });

    await queryInterface.changeColumn('ProjectTransactions', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.removeColumn('ProjectTransactions', 'timestamp');
  },
};
