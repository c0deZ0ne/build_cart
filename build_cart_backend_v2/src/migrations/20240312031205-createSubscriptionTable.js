// migration script to create the Subscriptions table
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Subscriptions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Unique identifier for each subscription',
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Reference to the user associated with this subscription',
      },
      type: {
        type: Sequelize.ENUM('FREE', 'PREMIUM'),
        allowNull: false,
        comment: 'Type of subscription: FREE or PREMIUM',
      },
      status: {
        type: Sequelize.ENUM('UNSUBSCRIBED', 'EXPIRED', 'SUBSCRIBED'),
        allowNull: false,
        comment: 'Status of the subscription',
      },
      usedTrialPeriod: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Flag indicating whether the trial period has been used',
      },
      expirationDate: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'Date when the subscription will expire',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Date when the subscription record was created',
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Date when the subscription record was last updated',
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Date when the subscription record was last deleted',
      },
    });

    await queryInterface.addConstraint('Subscriptions', {
      type: 'unique',
      fields: ['userId'],
      where: {
        status: 'SUBSCRIBED',
      },
      name: 'unique_active_subscription_per_user',
    });

    // Additional Indexing if needed
    await queryInterface.addIndex('Subscriptions', ['userId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Subscriptions', 'unique_active_subscription_per_user');
    await queryInterface.dropTable('Subscriptions');
  },
};
