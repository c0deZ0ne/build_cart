'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RfqRequests', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM(
          'PENDING',
          'ACCEPTED',
          'CANCELLED',
          'OPEN',
          'CLOSED',
          'FLAGGED',
          'DRAFT',
          'ARCHIVED',
        ),
        defaultValue: 'PENDING',
      },
      budgetVisibility: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      paymentTerm: {
        allowNull: false,
        type: Sequelize.ENUM('ESCROW', 'CREDIT', 'BNPL'),
      },
      deliveryDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deliveryAddress: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      deliveryInstructions: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      quoteDeadline: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      requestType: {
        allowNull: false,
        type: Sequelize.ENUM('PUBLIC', 'INVITATION'),
        defaultValue: 'PUBLIC',
      },
      tax: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      taxPercentage: {
        allowNull: true,
        type: Sequelize.DECIMAL(5, 2),
      },
      lpo: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      ProjectId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Projects',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      BuyerId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Buyers',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      CreatedById: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      UpdatedById: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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

    await queryInterface.createTable('RfqCategories', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      isActive: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    await queryInterface.bulkInsert('RfqCategories', [
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474c1',
        title: 'Logistics',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474c2',
        title: 'Doors',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474c3',
        title: 'Brick & Block',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474c4',
        title: 'Tiles & Marbles',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474c5',
        title: 'Roofing',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474c6',
        title: 'Plants and Machineries',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474c7',
        title: 'Windows',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474c8',
        title: 'Plumbing & Sanitary Wares',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474c9',
        title: 'Wood and Dry Walls',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474d1',
        title: 'Cement',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474d2',
        title: 'Glass',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474d3',
        title: 'POP Cement',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474d4',
        title: 'Paints',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474d5',
        title: 'Accessories',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474d6',
        title: 'Electricals',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474d7',
        title: 'Aggregate',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474d8',
        title: 'Steel & reinforcement',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474d9',
        title: 'Handrails and Aluminum',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.createTable('RfqItems', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      specification: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      product: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      metric: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.bulkInsert('RfqItems', [
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474e1',
        name: 'Rubber Hand Gloves PPE',
        specification: 'Rubber Hand Gloves',
        product: 'PPE',
        metric: 'Pairs',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474e2',
        name: 'Regular Hand Gloves PPE',
        specification: 'Regular Hand Gloves',
        product: 'PPE',
        metric: 'Pairs',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474e3',
        name: 'Googles PPE',
        specification: 'Googles',
        product: 'PPE',
        metric: 'Pairs',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474e4',
        name: 'Helmets PPE',
        specification: 'Helmets',
        product: 'PPE',
        metric: 'Nos',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474e5',
        name: 'Nose Cover PPE',
        specification: 'Nose Cover',
        product: 'PPE',
        metric: 'Nos',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474e6',
        name: 'Rainboot PPE',
        specification: 'Rainboot',
        product: 'PPE',
        metric: 'Pairs',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474e7',
        name: 'Safety Boots PPE',
        specification: 'Safety Boots',
        product: 'PPE',
        metric: 'Pairs',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474e8',
        name: 'Ear Cover PPE',
        specification: 'Ear Cover',
        product: 'PPE',
        metric: 'Pairs',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474e9',
        name: 'Heavy Duty Wheelbarrows',
        specification: 'Heavy Duty',
        product: 'Wheelbarrows',
        metric: 'Nos',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474f1',
        name: 'Light Weight Wheelbarrows',
        specification: 'Light Weight',
        product: 'Wheelbarrows',
        metric: 'Nos',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6d0493bd-0d15-40d6-931b-6036f18474f2',
        name: 'Plastic Wheelbarrows',
        specification: 'Plastic',
        product: 'Wheelbarrows',
        metric: 'Nos',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.createTable('RfqItemCategories', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      RfqItemId: {
        type: Sequelize.UUID,
        references: {
          model: 'RfqItems',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      RfqCategoryId: {
        type: Sequelize.UUID,
        references: {
          model: 'RfqCategories',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
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

    await queryInterface.createTable('RfqRequestMaterials', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      RfqRequestId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'RfqRequests',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      RfqItemId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'RfqItems',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      quantity: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2),
      },
      budget: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2),
      },
      CreatedById: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      UpdatedById: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
    await queryInterface.dropTable('RfqRequestMaterials');
    await queryInterface.dropTable('RfqRequests');
    await queryInterface.dropTable('RfqItemCategories');
    await queryInterface.dropTable('RfqItems');
    await queryInterface.dropTable('RfqCategories');
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_RfqRequests_status";`,
    );
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_RfqRequests_paymentTerm";
    `);
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_RfqRequests_requestType";
    `);
  },
};
