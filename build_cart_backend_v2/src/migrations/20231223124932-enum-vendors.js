'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Vendors', 'businessAddress', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('Vendors', 'businessContactId', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('Vendors', 'businessContactSignature', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('Vendors', 'businessName', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.renameColumn(
      'Vendors',
      'CertificateOfLocation',
      'certificateOfLocation',
    );
    await queryInterface.addColumn('Vendors', 'certificateOfIncorporation', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.removeColumn('Vendors', 'companySize');
    await queryInterface.removeColumn('Vendors', 'companyName');
    await queryInterface.removeColumn('Vendors', 'categories');
    await queryInterface.removeColumn('Vendors', 'contactName');
    await queryInterface.removeColumn('Vendors', 'contactPhone');
    await queryInterface.removeColumn('Vendors', 'contactEmail');
    await queryInterface.removeColumn('Vendors', 'address');
    await queryInterface.removeColumn('Vendors', 'BusinessNameDoc');
    await queryInterface.removeColumn('Vendors', 'tradingName');
    await queryInterface.removeColumn('Vendors', 'country');
    await queryInterface.removeColumn('Vendors', 'state');
    await queryInterface.removeColumn('Vendors', 'PIN');
    await queryInterface.removeColumn('Vendors', 'PIN_DocumentURl');
    await queryInterface.renameColumn('Vendors', 'RC_Number', 'businessRegNo');

    await queryInterface.addColumn('Vendors', 'businessSize', {
      type: Sequelize.DataTypes.ENUM('MICRO', 'SMALL', 'MEDIUM', 'LARGE'),
      allowNull: true,
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Vendors', 'RC_Number', 'businessRegNo');
    await queryInterface.renameColumn('Vendors', 'address', 'businessAddress');

    await queryInterface.addColumn('Vendors', 'location', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('Vendors', 'category', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('Vendors', 'registrationNumber', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addColumn('Vendors', 'name', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('Vendors', 'PIN_DocumentURl', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('Vendors', 'PIN', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addColumn('Vendors', 'latitude', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('Vendors', 'longitude', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addColumn('Vendors', 'companyName', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.removeColumn('Vendors', 'businessSize');
  },
};
