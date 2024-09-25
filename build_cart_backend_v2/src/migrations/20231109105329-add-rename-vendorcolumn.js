'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      'Vendors',
      'registrationNumber',
      'RC_Number',
    );
    await queryInterface.renameColumn('Vendors', 'businessSize', 'companySize');
    await queryInterface.addColumn('Vendors', 'PIN', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Vendors', 'PIN_DocumentURl', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Vendors', 'tier', {
      type: Sequelize.STRING,
      defaultValue: 'one',
      allowNull: true,
    });

    await queryInterface.addColumn('Vendors', 'CertificateOfLocation', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Vendors', 'BusinessNameDoc', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Vendors', 'BankStatement', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Vendors', 'UtilityBill', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Vendors', 'createdById', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Users', // Adjust to match your actual table name
        key: 'id', // Update with the correct column name if needed
      },
      onDelete: 'SET NULL',
    });
    await queryInterface.addColumn('Vendors', 'updatedById', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Users', // Adjust to match your actual table name
        key: 'id', // Update with the correct column name if needed
      },
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      'Vendors',
      'RC_Number',
      'registrationNumber',
    );
    await queryInterface.renameColumn('Vendors', 'companySize', 'businessSize');
    await queryInterface.removeColumn('Vendors', 'PIN');
    await queryInterface.removeColumn('Vendors', 'PIN_DocumentURl');
    await queryInterface.removeColumn('Vendors', 'tier');
    await queryInterface.removeColumn('Vendors', 'CertificateOfLocation');
    await queryInterface.removeColumn('Vendors', 'BusinessNameDoc');
    await queryInterface.removeColumn('Vendors', 'BankStatement');
    await queryInterface.removeColumn('Vendors', 'UtilityBill');
    await queryInterface.removeColumn('Vendors', 'createdById');
    await queryInterface.removeColumn('Vendors', 'updatedById');
  },
};
