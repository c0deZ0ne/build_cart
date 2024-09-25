'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add columns to Invitations table
    await queryInterface.addColumn('Invitations', 'projectId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Projects',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addColumn('Invitations', 'buyerPhone', {
      type: Sequelize.STRING, // Adjust the data type based on your needs
      allowNull: true, // Modify this based on your requirements
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove added columns from Invitations table
    await queryInterface.removeColumn('Invitations', 'projectId');
    await queryInterface.removeColumn('Invitations', 'buyerPhone');
  },
};
