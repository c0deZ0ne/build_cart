'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the 'ContractId' column to 'Orders'
    await queryInterface.addColumn('Orders', 'ContractId', {
      type: Sequelize.UUID,
      allowNull: true,
      unique: false,
      references: {
        model: 'Contracts',
        key: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the 'ContractId' column from 'Orders'
    await queryInterface.removeColumn('Orders', 'ContractId');
  },
};
