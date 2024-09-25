'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Documents', 'recordId', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Documents', 'UserId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Users', // Assuming your User model is named 'Users'
        key: 'id',
      },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('Documents', 'SponsorId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Sponsors', // Assuming your User model is named 'Users'
        key: 'id',
      },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL',
    });
    await queryInterface.addColumn('Documents', 'BuyerId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Buyers', // Assuming your User model is named 'Users'
        key: 'id',
      },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Documents', 'recordId');
    await queryInterface.removeColumn('Documents', 'UserId');
    await queryInterface.removeColumn('Documents', 'BuyerId');
    await queryInterface.removeColumn('Documents', 'SponsorId');
  },
};
