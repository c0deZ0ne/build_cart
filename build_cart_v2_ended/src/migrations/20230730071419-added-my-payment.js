'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MyPayments', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      BuyerId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      ContractId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      VendorId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      PaymentId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add foreign key constraints
    await queryInterface.addConstraint('MyPayments', {
      fields: ['BuyerId'],
      type: 'foreign key',
      name: 'fk_buyer',
      references: {
        table: 'Buyers', // Replace 'Buyers' with the actual table name for the 'Buyer' model
        field: 'id', // Replace 'id' with the actual primary key field for the 'Buyer' model
      },
      onDelete: 'cascade',
    });

    await queryInterface.addConstraint('MyPayments', {
      fields: ['ContractId'],
      type: 'foreign key',
      name: 'fk_contract',
      references: {
        table: 'Contracts', // Replace 'Contracts' with the actual table name for the 'Contract' model
        field: 'id', // Replace 'id' with the actual primary key field for the 'Contract' model
      },
      onDelete: 'cascade',
    });

    await queryInterface.addConstraint('MyPayments', {
      fields: ['VendorId'],
      type: 'foreign key',
      name: 'fk_vendor',
      references: {
        table: 'Vendors', // Replace 'Vendors' with the actual table name for the 'Vendor' model
        field: 'id', // Replace 'id' with the actual primary key field for the 'Vendor' model
      },
      onDelete: 'cascade',
    });

    await queryInterface.addConstraint('MyPayments', {
      fields: ['PaymentId'],
      type: 'foreign key',
      name: 'fk_payment',
      references: {
        table: 'Payments', // Replace 'Payments' with the actual table name for the 'Payment' model
        field: 'id', // Replace 'id' with the actual primary key field for the 'Payment' model
      },
      onDelete: 'cascade',
    });
  },

  down: async (queryInterface) => {
    // Drop the table if the migration needs to be rolled back
    await queryInterface.dropTable('MyPayments');
  },
};
