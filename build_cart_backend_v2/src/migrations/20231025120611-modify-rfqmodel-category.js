'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('RfqItems', 'rfqCategoryId', {
      allowNull: true,
      type: Sequelize.UUID,
      references: {
        model: 'RfqCategories', // Update with your actual category model name
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addColumn('RfqRequestMaterials', 'rfqCategoryId', {
      allowNull: true,
      type: Sequelize.UUID,
      references: {
        model: 'RfqCategories', // Update with your actual category model name
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addColumn('RfqQuotes', 'rfqRequestMaterialId', {
      allowNull: true,
      type: Sequelize.UUID,
      references: {
        model: 'RfqRequestMaterials', // Update with your actual category model name
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('RfqItems', 'rfqCategoryId');
    await queryInterface.removeColumn('RfqQuotes', 'rfqRequestMaterialId');
    await queryInterface.removeColumn('RfqRequestMaterial', 'rfqCategoryId');
  },
};
