'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Contracts', 'isDisbursed', {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn('Contracts', 'disbursedAt', {
      allowNull: true,
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn('Contracts', 'DisbursedById', {
      allowNull: true,
      type: Sequelize.UUID,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Contracts', 'isDisbursed');
    await queryInterface.removeColumn('Contracts', 'disbursedAt');
    await queryInterface.removeColumn('Contracts', 'DisbursedById');
  },
};
