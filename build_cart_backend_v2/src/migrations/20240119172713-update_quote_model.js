'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     */
    await queryInterface.addColumn('RfqQuotes', 'startDeliveryDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('RfqQuotes', 'endDeliveryDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     */
    await queryInterface.removeColumn('RfqQuotes', 'startDeliveryDate');
    await queryInterface.removeColumn('RfqQuotes', 'endDeliveryDate');
  },
};
