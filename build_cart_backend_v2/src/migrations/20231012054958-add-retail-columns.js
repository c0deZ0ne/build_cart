'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('RetailTransactions', 'labourHackID', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'LabourHacks',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addColumn(
      'RetailTransactions',
      'productSpecificationProductID',
      {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'ProductSpecificationProducts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    );

    await queryInterface.addColumn('RetailTransactions', 'description', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn(
      'RetailUsers',
      'is_phone_number_on_whatsapp',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    );

    await queryInterface.addColumn(
      'RetailUsers',
      'can_receive_marketing_info',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    );

    await queryInterface.removeConstraint(
      'RetailTransactions',
      'RetailTransactions_userID_fkey',
    );

    // Add a new foreign key constraint with cascading behavior
    await queryInterface.addConstraint('RetailTransactions', {
      fields: ['userID'],
      type: 'foreign key',
      name: 'RetailTransactions_userID_fkey_cascade',
      references: {
        //Required field
        table: 'RetailUsers',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('RetailTransactions', 'labourHackID');
    await queryInterface.removeColumn(
      'RetailTransactions',
      'productSpecificationProductID',
    );
    await queryInterface.removeColumn('RetailTransactions', 'description');

    await queryInterface.removeColumn(
      'RetailUsers',
      'is_phone_number_on_whatsapp',
    );
    await queryInterface.removeColumn(
      'RetailUsers',
      'can_receive_marketing_info',
    );

    // Remove the new foreign key constraint
    await queryInterface.removeConstraint(
      'RetailTransactions',
      'RetailTransactions_userID_fkey_cascade',
    );

    // Add back the old foreign key constraint
    await queryInterface.addConstraint('RetailTransactions', {
      fields: ['userID'],
      type: 'foreign key',
      name: 'RetailTransactions_userID_fkey',
      references: {
        //Required field
        table: 'RetailUsers',
        field: 'id',
      },
    });
  },
};
