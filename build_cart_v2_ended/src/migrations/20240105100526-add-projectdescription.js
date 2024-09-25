'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Projects', 'description', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'Please provide a description for this project',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Projects', 'description');
  },
};
