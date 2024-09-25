'use strict';

module.exports = {
  up: async (queryInterface) => {
    // Drop the index first
    await queryInterface.removeIndex(
      'MyInvitations',
      'my_invitations_user_invitation_unique',
    );

    // Drop the table
    await queryInterface.dropTable('MyInvitations');
  },

  down: async (queryInterface, Sequelize) => {
    // Recreate the table
    await queryInterface.createTable('MyInvitations', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      UserId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      InvitationId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Invitations',
          key: 'id',
          onDelete: 'CASCADE',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add the index back
    await queryInterface.addIndex('MyInvitations', {
      unique: true,
      fields: ['UserId', 'InvitationId'],
      name: 'my_invitations_user_invitation_unique',
    });
  },
};
