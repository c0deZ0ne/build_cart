'use strict';

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_Users_status" ADD VALUE IF NOT EXISTS \'PAUSED\';',
        { transaction: t },
      );
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_Users_status" DROP VALUE IF EXISTS \'PAUSED\';',
        { transaction: t },
      );
    });
  },
};
