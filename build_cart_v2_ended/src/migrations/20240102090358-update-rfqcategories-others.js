'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Assuming "RfqCategories" is the name of your table
    await queryInterface.bulkInsert(
      'RfqCategories',
      [
        {
          id: '524ceea2-56a2-4100-b98d-3983cfe60629',
          title: 'Others', // Replace with the new category name you want to add
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    // Remove the new category added in the up migration
    await queryInterface.bulkDelete('RfqCategories', { title: 'Others' }, {});
  },
};
