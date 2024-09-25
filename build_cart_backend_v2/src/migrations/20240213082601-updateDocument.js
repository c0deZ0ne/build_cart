'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Documents', 'FundManagerId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'FundManagers',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.changeColumn('Documents', 'BuilderId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Builders',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.changeColumn('Documents', 'VendorId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Vendors',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Documents', 'FundManagerId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'FundManagers',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.changeColumn('Documents', 'BuilderId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Builders',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.changeColumn('Documents', 'VendorId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Vendors',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },
};
