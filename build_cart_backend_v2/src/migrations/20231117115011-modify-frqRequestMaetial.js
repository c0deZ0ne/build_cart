'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the 'ProjectId' column to 'RfqRequestMaterials'
    await queryInterface.addColumn('RfqRequestMaterials', 'ProjectId', {
      type: Sequelize.UUID,
      allowNull: true,
      unique: false,
      references: {
        model: 'Projects',
        key: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

    // Update 'ProjectId' based on associated 'RfqRequest'
    await queryInterface.sequelize.query(`
      UPDATE "RfqRequestMaterials" AS rm
      SET "ProjectId" = rq."ProjectId"
      FROM "RfqRequests" AS rq
      WHERE rm."RfqRequestId" = rq."id";
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the 'ProjectId' column from 'RfqRequestMaterials'
    await queryInterface.removeColumn('RfqRequestMaterials', 'ProjectId');
  },
};
