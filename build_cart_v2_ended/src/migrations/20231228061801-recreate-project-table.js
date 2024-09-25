'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_Projects_status" ADD VALUE IF NOT EXISTS \'COMPLETED\';',
    );
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_Projects_status" ADD VALUE IF NOT EXISTS \'PENDING\';',
    );
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_Projects_status" ADD VALUE IF NOT EXISTS \'PAUSED\';',
    );
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_Projects_status" ADD VALUE IF NOT EXISTS \'DISPUTE\';',
    );

    await queryInterface.addColumn('Projects', 'ProjectType', {
      type: Sequelize.DataTypes.ENUM('REQUEST', 'INVITE', 'COMPANY'),
      allowNull: true,
      defaultValue: 'COMPANY',
    });
    await queryInterface.addColumn('Projects', 'ownerId', {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Projects', 'ProjectType');
    await queryInterface.removeColumn('Projects', 'ownerId');
  },
};
