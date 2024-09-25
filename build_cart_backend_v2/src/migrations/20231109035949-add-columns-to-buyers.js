'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Buyers', 'tier', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Buyers', 'RC_Number', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Buyers', 'isBusinessVerified', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });
    await queryInterface.addColumn('Buyers', 'companySize', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Buyers', 'PIN', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Buyers', 'PIN_DocumentURl', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Buyers', 'CertificateOfLocation', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Buyers', 'BusinessNameDoc', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Buyers', 'BankStatement', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Buyers', 'UtilityBill', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Buyers', 'createdById', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Users', // Adjust to match your actual table name
        key: 'id', // Update with the correct column name if needed
      },
      onDelete: 'SET NULL',
    });
    await queryInterface.addColumn('Buyers', 'updatedById', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Users', // Adjust to match your actual table name
        key: 'id', // Update with the correct column name if needed
      },
      onDelete: 'SET NULL',
    });
    await queryInterface.addColumn('Buyers', 'companyName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Buyers', 'companyLocation', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn('Buyers', 'IsbusinessVerified'),
      queryInterface.removeColumn('Buyers', 'companySize'),
      queryInterface.removeColumn('Buyers', 'PIN'),
      queryInterface.removeColumn('Buyers', 'PIN_DocumentURl'),
      queryInterface.removeColumn('Buyers', 'tier'),
      queryInterface.removeColumn('Buyers', 'CertificateOfLocation'),
      queryInterface.removeColumn('Buyers', 'BusinessNameDoc'),
      queryInterface.removeColumn('Buyers', 'BankStatement'),
      queryInterface.removeColumn('Buyers', 'UtilityBill'),
      queryInterface.removeColumn('Buyers', 'createdById'),
      queryInterface.removeColumn('Buyers', 'updatedById'),
      queryInterface.removeColumn('Buyers', 'companyName'),
      queryInterface.removeColumn('Buyers', 'companyLocation'),
      queryInterface.removeColumn('Buyers', 'RC_Number'),
    ]);
  },
};
