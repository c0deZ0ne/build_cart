'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'subscriptionId', {
      type: Sequelize.UUID,
      allowNull: true, // Changed to false since it's a reference to Subscriptions
      references: {
        model: 'Subscriptions',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'Reference to the subscription associated with the user',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'subscriptionId');
  },
};
