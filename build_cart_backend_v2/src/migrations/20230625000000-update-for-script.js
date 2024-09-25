'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Vendors', 'about', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('Buyers', 'about', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('RfqRequests', 'deliveryAddress', {
      allowNull: true,
      type: Sequelize.STRING,
    });
    await queryInterface.changeColumn('RfqRequests', 'deliveryDate', {
      allowNull: true,
      type: Sequelize.DATE,
    });
    await queryInterface.changeColumn('RfqRequests', 'quoteDeadline', {
      allowNull: true,
      type: Sequelize.DATE,
    });
    await queryInterface.changeColumn('RfqRequestMaterials', 'RfqItemId', {
      allowNull: true,
      type: Sequelize.UUID,
    });
    await queryInterface.changeColumn('RfqRequestMaterials', 'budget', {
      allowNull: false,
      type: Sequelize.DECIMAL(100, 2),
    });
    await queryInterface.changeColumn('Contracts', 'fee', {
      allowNull: false,
      type: Sequelize.DECIMAL(100, 2),
    });
    await queryInterface.removeConstraint(
      'Contracts',
      'Contracts_RfqQuoteId_key',
    );
  },

  down: async (queryInterface) => {
    await queryInterface.changeColumn('Vendors', 'about', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('Buyers', 'about', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('RfqRequests', 'deliveryAddress', {
      allowNull: false,
      type: Sequelize.STRING,
    });
    await queryInterface.changeColumn('RfqRequests', 'deliveryDate', {
      allowNull: false,
      type: Sequelize.DATE,
    });
    await queryInterface.changeColumn('RfqRequests', 'quoteDeadline', {
      allowNull: false,
      type: Sequelize.DATE,
    });
    await queryInterface.changeColumn('RfqRequestMaterials', 'RfqItemId', {
      allowNull: false,
      type: Sequelize.UUID,
    });
    await queryInterface.changeColumn('RfqRequestMaterials', 'budget', {
      allowNull: false,
      type: Sequelize.DECIMAL(10, 2),
    });
    await queryInterface.changeColumn('Contracts', 'fee', {
      allowNull: false,
      type: Sequelize.DECIMAL(10, 2),
    });
    await queryInterface.addConstraint('Contracts', {
      fields: ['RfqQuoteId'],
      unique: true,
      name: 'Contracts_RfqQuoteId_key',
    });
  },
};
