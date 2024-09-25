'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the new enum column

    await queryInterface.addColumn('Users', 'IdVerificationStatus', {
      type: Sequelize.DataTypes.ENUM('PENDING', 'ONGOING','COMPLETED'),
      allowNull: true,
      defaultValue: "PENDING"
    });
    await queryInterface.addColumn('Users', 'recovery_request', {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    });
    await queryInterface.addColumn('Users', 'recovery_request_type', {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'IdVerificationStatus');
    await queryInterface.removeColumn('Users', 'recovery_request');
    await queryInterface.removeColumn('Users', 'recovery_request_type');
  },
};
