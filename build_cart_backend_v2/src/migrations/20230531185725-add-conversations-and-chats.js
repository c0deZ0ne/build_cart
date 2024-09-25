'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Chats', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      BuyerId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Buyers',
          key: 'id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      },
      VendorId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Vendors',
          key: 'id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
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
    await queryInterface.addIndex('Chats', ['VendorId', 'BuyerId'], {
      unique: true,
    });

    await queryInterface.createTable('Conversations', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      ChatId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Chats',
          key: 'id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      },
      UserId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      },
      RepliedConversationId: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: 'Conversations',
          key: 'id',
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        },
      },
      text: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
        defaultValue: [],
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
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Conversations');
    await queryInterface.dropTable('Chats');
  },
};
