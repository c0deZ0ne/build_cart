'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'Users', // Table name
      'userType', // Column name
      {
        type: Sequelize.ENUM(
          'SUPER_ADMIN',
          'BUILDER',
          'SUPPLIER',
          'FUND_MANAGER',
          'ADMIN',
        ),
        allowNull: true,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'Users', // Table name
      'userType', // Column name
      {
        type: Sequelize.ENUM(
          'SUPER_ADMIN',
          'BUILDER',
          'VENDOR',
          'FUND_MANAGER',
          'ADMIN',
        ),
        allowNull: true,
      },
      { transaction },
    );
  },
};
