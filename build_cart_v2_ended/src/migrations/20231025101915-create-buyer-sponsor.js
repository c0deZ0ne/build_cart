'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BuyerSponsors', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      SponsorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Sponsors',
          key: 'id',
        },
      },
      BuyerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Buyers',
          key: 'id',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      CreatedById: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      migratedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the BuyerProjects table
    await queryInterface.dropTable('BuyerSponsors');
  },
};
