'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('RfqRequestMaterials', 'description', {
      type: Sequelize.TEXT,
      allowNull: true, 
    });
    await queryInterface.changeColumn('Projects', 'description', {
      type: Sequelize.TEXT,
      allowNull: true, 
    });
    await queryInterface.changeColumn('RfqQuoteMaterials', 'description', {
      type: Sequelize.TEXT,
      allowNull: true, 
    });
    await queryInterface.changeColumn('RfqBargains', 'description', {
      type: Sequelize.TEXT,
      allowNull: true, 
    });
    await queryInterface.addColumn('RfqRequestMaterials', 'specification', {
      type: Sequelize.STRING,
      allowNull: true, 
    });
  },
  down: async (queryInterface, Sequelize) => {
  },
};
