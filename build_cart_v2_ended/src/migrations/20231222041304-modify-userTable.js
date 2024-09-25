'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'BuyerId', 'BuilderId');
    await queryInterface.renameColumn('Users', 'SponsorId', 'FundManagerId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'BuilderId', 'BuyerId');
    await queryInterface.renameColumn('Users', 'FundManagerId', 'SponsorId');
  },
};
