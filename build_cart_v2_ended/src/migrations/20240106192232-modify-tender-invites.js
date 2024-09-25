'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ProjectTenders', 'blacklistedBuilders', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: [],
    });
    await queryInterface.addColumn('ProjectTenders', 'invitedBuilders', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: [],
    });
    await queryInterface.addColumn('ProjectTenders', 'logo', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('ProjectTenders', 'projectName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('ProjectTenders', 'BOQ', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ProjectTenders', 'blacklistedBuilders');
    await queryInterface.removeColumn('ProjectTenders', 'invitedBuilders');
    await queryInterface.removeColumn('ProjectTenders', 'logo');
    await queryInterface.removeColumn('ProjectTenders', 'projectName');
    await queryInterface.removeColumn('ProjectTenders', 'BOQ');
  },
};
