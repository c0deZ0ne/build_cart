'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('UserTransactions', 'itemName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('UserTransactions', 'paymentType', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('UserTransactions', 'itemName');
    await queryInterface.removeColumn('UserTransactions', 'paymentType');
  },
};
