'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     */
    await queryInterface.addColumn('Builders', 'certificateOfIncorporation', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Builders', 'BusinessContactId', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Builders', 'BusinessContactSignature', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     */
    await queryInterface.removeColumn('Builders', 'certificateOfIncorporation');
    await queryInterface.removeColumn('Builders', 'BusinessContactId');
    await queryInterface.removeColumn('Builders', 'BusinessContactSignature');
  },
};
