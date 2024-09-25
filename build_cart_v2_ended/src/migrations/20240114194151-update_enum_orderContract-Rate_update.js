'use strict';

// const path = require('path');
// import { OrderStatus } from '../src/modules/order/models/order.model';

/** @type {import('sequelize-cli').Migration} */
//import { OrderStatus } from '../src/modules/order/models/order.model';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     */
    await queryInterface.renameColumn(
      'RateReviewVendors',
      'review',
      'builderReview',
    );
    await queryInterface.renameColumn(
      'RateReviewVendors',
      'rateScore',
      'builderRateScore',
    );

    // Add new columns
    await queryInterface.addColumn('RateReviewVendors', 'vendorReview', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('RateReviewVendors', 'vendorRateScore', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.renameTable('RateReviewVendors', 'RateReviews');

    await queryInterface.sequelize.query(`
    ALTER TYPE "enum_Orders_status"
    ADD VALUE IF NOT EXISTS 'UPCOMING';
    `);

    await queryInterface.sequelize.query(`
    ALTER TYPE "enum_Contracts_deliveryStatus"
    ADD VALUE IF NOT EXISTS 'INREVIEW';
    `);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     */
    await queryInterface.renameTable('RateReviews', 'RateReviewVendors');
    await queryInterface.removeColumn('RateReviewVendors', 'vendorReview');

    await queryInterface.removeColumn('RateReviewVendors', 'vendorRateScore');

    await queryInterface.renameColumn(
      'RateReviewVendors',
      'builderReview',
      'review',
    );
    await queryInterface.renameColumn(
      'RateReviewVendors',
      'builderRateScore',
      'rateScore',
    );

    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_Orders_status" DROP VALUE IF EXISTS \'UPCOMING\';',
        { transaction: t },
      );
    });

    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_Contracts_deliveryStatus" DROP VALUE IF EXISTS \'INREVIEW\';',
        { transaction: t },
      );
    });
  },
};
