'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Disputes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      VendorId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Vendors',
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
      ContractId: {
        allowNull: false,
        type: Sequelize.UUID,
        unique: true,
        references: {
          model: 'Contracts',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      reason: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      message: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      proofs: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
      status: {
        allowNull: false,
        defaultValue: 'PENDING',
        type: Sequelize.ENUM('PENDING', 'RESOLVED', 'REFUNDED'),
      },
      resolvedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      refundedAt: {
        allowNull: true,
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('Disputes');
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_Disputes_status";`,
    );
  },
};
