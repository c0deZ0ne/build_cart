'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('RetailTransactions', 'builderID', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Builders',
        key: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });
    await queryInterface.removeColumn('RetailTransactions', 'userID');
    await queryInterface.changeColumn('RetailTransactions', 'delivery_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('RetailTransactions', 'budget', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('RetailTransactions', 'userID', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'RetailUsers',
        key: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

    await queryInterface.removeColumn('RetailTransactions', 'builderID');

    await queryInterface.changeColumn('RetailTransactions', 'delivery_date', {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.changeColumn('RetailTransactions', 'budget', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
