// migrations/20231101120000-create-user-project.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserProjects', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      UserId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ProjectId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Projects',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

    // Create indexes for better performance
    await queryInterface.addIndex('UserProjects', ['UserId']);
    await queryInterface.addIndex('UserProjects', ['ProjectId']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('UserProjects');
  },
};
