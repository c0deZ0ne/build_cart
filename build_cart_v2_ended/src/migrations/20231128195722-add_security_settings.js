'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'twoFactorAuthEnabled', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false, // Set a default value if needed
    });

    await queryInterface.addColumn('Users', 'signatures', {
      type: Sequelize.JSON, // Assuming signatureLinks is an array of strings
      allowNull: true,
      defaultValue: [],
    });

    await queryInterface.addColumn('Users', 'emailNotificationEnabled', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });

    await queryInterface.addColumn('Users', 'smsNotificationEnabled', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'TwoFactorAuthEnabled');
    await queryInterface.removeColumn('Users', 'ChangePassword');
    await queryInterface.removeColumn('Users', 'Signatures');
    await queryInterface.removeColumn('Users', 'emailNotificationEnabled');
    await queryInterface.removeColumn('Users', 'smsNotificationEnabled');
  },
};
