'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Builders', 'businessAddress', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.renameColumn(
      'Builders',
      'companyName',
      'businessName',
    );
    await queryInterface.removeColumn('Builders', 'category');
    await queryInterface.removeColumn('Builders', 'phone');
    await queryInterface.removeColumn('Builders', 'name');
    await queryInterface.removeColumn('Builders', 'BusinessNameDoc');
    await queryInterface.removeColumn('Builders', 'longitude');
    await queryInterface.removeColumn('Builders', 'registrationNumber');
    await queryInterface.removeColumn('Builders', 'latitude');
    await queryInterface.removeColumn('Builders', 'companyLocation');
    await queryInterface.removeColumn('Builders', 'country');
    await queryInterface.removeColumn('Builders', 'companySize');
    await queryInterface.removeColumn('Builders', 'state');
    await queryInterface.removeColumn('Builders', 'location');
    await queryInterface.removeColumn('Builders', 'address');
    await queryInterface.renameColumn('Builders', 'RC_Number', 'businessRegNo');
    await queryInterface.renameColumn(
      'Builders',
      'CertificateOfLocation',
      'certificateOfLocation',
    );

    await queryInterface.addColumn('Builders', 'businessSize', {
      type: Sequelize.DataTypes.ENUM('MICRO', 'SMALL', 'MEDIUM', 'LARGE'),
      allowNull: true,
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Builders', 'businessRegNo', 'RC_Number');
    await queryInterface.renameColumn('Builders', 'businessAddress', 'address');

    await queryInterface.addColumn('Builders', 'location', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('Builders', 'category', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addColumn('Builders', 'name', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('Builders', 'PIN_DocumentURl', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('Builders', 'PIN', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addColumn('Builders', 'latitude', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('Builders', 'longitude', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addColumn('Builders', 'companyName', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.removeColumn('Builders', 'businessSize');
    await queryInterface.removeColumn('Builders', 'businessAddress');
  },
};
