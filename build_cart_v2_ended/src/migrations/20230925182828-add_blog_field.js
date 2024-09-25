'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Blogs', 'postedBy', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Blogs', 'EditedBy', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Blogs', 'postedBy');
    await queryInterface.removeColumn('Blogs', 'EditedBy');
  },
};
