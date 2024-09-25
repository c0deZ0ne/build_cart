'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `CREATE TYPE "enum_contract_AdminPaymentRequestStatus" AS ENUM('PENDING', 'ACCEPTED', 'DECLINED', 'DISABLED', 'BLOCKED');`,
    );

    await queryInterface.addColumn('Contracts', 'adminPaymentRequestStatus', {
      type: Sequelize.DataTypes.ENUM(
        'PENDING',
        'ACCEPTED',
        'DECLINED',
        'DISABLED',
        'BLOCKED',
      ),
      allowNull: false,
      defaultValue: 'DISABLED',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Contracts', 'adminPaymentRequestStatus');
    await queryInterface.sequelize.query(
      `DROP TYPE "enum_contract_AdminPaymentRequestStatus";`,
      { type: Sequelize.QueryTypes.RAW },
    );
  },
};
