'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create a new enum type, make sure its name isn't the same as current column's enum type
    await queryInterface.addColumn('Sponsors', 'location', {
      type: Sequelize.ENUM('LOCAL', 'INTERNATIONAL'),
      allowNull: true,
    });

    // Add new contactName field
    await queryInterface.addColumn('Sponsors', 'contactName', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Add new country field
    await queryInterface.addColumn('Sponsors', 'country', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Add new contactEmail field
    await queryInterface.addColumn('Sponsors', 'contactEmail', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Add new contactPhone field
    await queryInterface.addColumn('Sponsors', 'contactPhone', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    //remove
    await queryInterface.removeColumn('Sponsors', 'location');
    await queryInterface.removeColumn('Sponsors', 'contactName');
    await queryInterface.removeColumn('Sponsors', 'contactEmail');
    await queryInterface.removeColumn('Sponsors', 'contactPhone');
    await queryInterface.removeColumn('Sponsors', 'country');
  },
};
