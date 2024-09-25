'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Projects', 'budgetAmount', {
      type: Sequelize.FLOAT, // Adjust the data type based on your requirements (FLOAT, DECIMAL, etc.)
      allowNull: true,
      defaultValue: 0, // Set a default value if needed
    });

    await queryInterface.addColumn('Projects', 'amountSpent', {
      type: Sequelize.FLOAT, // Adjust the data type based on your requirements (FLOAT, DECIMAL, etc.)
      allowNull: true,
      defaultValue: 0, // Set a default value if needed
    });

    await queryInterface.addColumn('Projects', 'amountLeft', {
      type: Sequelize.FLOAT, // Adjust the data type based on your requirements (FLOAT, DECIMAL, etc.)
      allowNull: true,
      defaultValue: 0, // Set a default value if needed
    });

    await queryInterface.addColumn('Projects', 'fundedAt', {
      type: Sequelize.DATE, // Adjust the data type based on your requirements (DATE, DATEONLY, etc.)
      allowNull: true,
    });
    await queryInterface.addColumn('Projects', 'isFunded', {
      type: Sequelize.BOOLEAN,
      defaultValue: false, // Adjust the data type based on your requirements (DATE, DATEONLY, etc.)
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Projects', 'budgetAmount');
    await queryInterface.removeColumn('Projects', 'amountSpent');
    await queryInterface.removeColumn('Projects', 'amountLeft');
    await queryInterface.removeColumn('Projects', 'fundedAt');
  },
};
