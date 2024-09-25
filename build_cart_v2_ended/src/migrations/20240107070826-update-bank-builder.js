'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.

     */
    await queryInterface.sequelize.query(
      `
      ALTER TABLE "Banks" ALTER COLUMN "VendorId" DROP NOT NULL;
      `,
    );

    await queryInterface.changeColumn('Banks', 'VendorId', {
      type: Sequelize.UUID,
      allowNull: true,
      unique: true,
      references: {
        model: 'Vendors',
        key: 'id',
        onDelete: 'CASCADE',
      },
    });
    queryInterface.addConstraint('Banks', {
      type: 'unique',
      fields: ['VendorId'],
      name: 'unique_vendor_id_constraint',
    });

    await queryInterface.addColumn('Banks', 'BuilderId', {
      type: Sequelize.UUID,
      allowNull: true,
      unique: true,
      references: {
        model: 'Builders',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *

     */

    await queryInterface.removeColumn('Banks', 'BuilderId');
    await queryInterface.removeConstraint(
      'Banks',
      'unique_vendor_id_constraint',
    );
    await queryInterface.changeColumn('Banks', 'VendorId', {
      type: Sequelize.UUID,
      allowNull: true,
      unique: true,
      references: {
        model: 'Vendors',
        key: 'id',
        onDelete: 'CASCADE',
      },
    });
  },
};
