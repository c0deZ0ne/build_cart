'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Blogs', 'blogContent', {
      type: Sequelize.TEXT,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.changeColumn('Blogs', 'blogContent', {
      type: Sequelize.STRING(500000),
    });
  },
};
