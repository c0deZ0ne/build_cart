'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change BuyerId column to allow null values
    await queryInterface.changeColumn('Contracts', 'BuyerId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Buyers',
        key: 'id',
      },
    });

    // add REOPENED to status of Rfq

    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_rfqquotes_status_fix_new" ADD VALUE IF NOT EXISTS \'REOPENED\';',
    );

    // Add SponsorId column with null values and foreign key constraint
    await queryInterface.addColumn('Contracts', 'SponsorId', {
      type: Sequelize.UUID,
      notNull: false,
      references: {
        model: 'Sponsors',
        key: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Change BuyerId column back to not allow null values
    await queryInterface.changeColumn('Contracts', 'BuyerId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Buyers',
        key: 'id',
      },
    });

    // Remove SponsorId column
    await queryInterface.removeColumn('Contracts', 'SponsorId');

    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_RfqQuotes_status" DROP VALUE IF EXISTS \'REOPENED\';',
    );
  },
};
