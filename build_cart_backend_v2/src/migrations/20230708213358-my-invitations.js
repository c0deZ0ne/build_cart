'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
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

    await queryInterface.addIndex('MyInvitations', {
      unique: true,
      fields: ['UserId', 'InvitationId'],
      name: 'my_invitations_user_invitation_unique',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('MyInvitations');
  },
};
