'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('RfqRequests', 'SponsorId', {
      type: Sequelize.UUID, // Adjust the data type if needed
      allowNull: true,
      references: {
        model: 'Sponsors', // Adjust to match your actual table name
        key: 'id', // Update with the correct column name if needed
      },
    });

    await queryInterface.changeColumn('RfqRequests', 'BuyerId', {
      type: Sequelize.UUID,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('RfqRequests', 'SponsorId'),
      await queryInterface.changeColumn('RfqRequests', 'BuyerId', {
        type: Sequelize.UUID,
        allowNull: false,
      });
  },
};
