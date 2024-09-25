'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MySponsors', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      BuyerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Buyers', // Assuming this is the name of the referenced table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ProjectId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Projects', // Assuming this is the name of the referenced table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      SponsorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Sponsors', // Assuming this is the name of the referenced table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      totalCredited: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      totalSpent: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      balance: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addColumn('SharedProjects', 'MySponsorId', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUID4,
      allowNull: true,
      references: {
        model: 'MySponsors',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('SharedProjects', 'MySponsorId');
    await queryInterface.dropTable('MySponsors');
  },
};
