'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Payments', 'pub_date');
    await queryInterface.removeColumn('Payments', 'modified_date');
    await queryInterface.removeColumn('Payments', 'RfqRequestId');
    // await queryInterface.removeColumn('Payments', 'RfqRequestMaterialId');
    //await queryInterface.removeColumn('Payments', 'match_currency');
    await queryInterface.removeColumn('Payments', 'vend_token');
    await queryInterface.renameColumn('Payments', 'title', 'description');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Payments', 'pub_date');
    await queryInterface.addColumn('Payments', 'modified_date');
    await queryInterface.addColumn('Payments', 'RfqRequestId');
    // await queryInterface.addColumn('Payments', 'RfqRequestMaterialId');
    //await queryInterface.addColumn('Payments', 'match_currency')
    await queryInterface.addColumn('Payments', 'vend_token');
    await queryInterface.renameColumn('Payments', 'description', 'title');
  },
};
