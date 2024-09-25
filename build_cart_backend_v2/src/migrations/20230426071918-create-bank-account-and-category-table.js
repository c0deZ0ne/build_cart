'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Banks', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      VendorId: {
        allowNull: false,
        type: Sequelize.UUID,
        unique: true,
        references: {
          model: 'Vendors',
          key: 'id',
          onDelete: 'CASCADE',
        },
      },
      accountName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      accountNumber: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING,
      },
      bankName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      bankSlug: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      bankCode: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      UpdatedById: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'SET NULL',
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

    await queryInterface.createTable('Categories', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    await queryInterface.bulkInsert('Categories', [
      {
        id: 'c13d2b24-1e1c-4d80-b8fb-96f7dd97c899',
        name: 'Real Estate',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '20e601b7-8466-4a2e-8d77-08e9f3f8a385',
        name: 'Construction',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '0d9db9f9-0bf1-47aa-bff2-39b15c13b8e7',
        name: 'Energy',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'd7ba655c-12c6-41a2-a2c6-b9e2ee8d5a5b',
        name: 'Public Sector',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'cb2c8448-f5b5-4c5d-821d-2e1faa5a5c5f',
        name: 'Education',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'f090ed51-8b2f-4060-8d3a-50b16f2b1e61',
        name: 'Agriculture',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '7cc9b35e-05b6-44ec-96c7-039062e6d996',
        name: 'Financial Institution',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4e4c4a67-0a4b-4c27-a9e7-09b281935acd',
        name: 'Professional Services',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '8af7f38b-6d71-4881-9445-5a5e5cf6e5dc',
        name: 'Other',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Categories');
    await queryInterface.dropTable('Banks');
  },
};
