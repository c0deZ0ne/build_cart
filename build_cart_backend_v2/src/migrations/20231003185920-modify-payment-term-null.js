'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('RfqRequests', 'paymentTerm', {
      type: Sequelize.ENUM('ESCROW', 'CREDIT', 'BNPL'),
      allowNull: true, // Set allowNull to true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // This is the code to revert the change if needed
    await queryInterface.changeColumn('RfqRequests', 'paymentTerm', {
      type: Sequelize.ENUM('ESCROW', 'CREDIT', 'BNPL'),
      allowNull: false, // Set allowNull back to false
    });
  },
};
