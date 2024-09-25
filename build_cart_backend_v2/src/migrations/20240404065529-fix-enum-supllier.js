'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TYPE enum_Users_userType_fix_new AS ENUM ('SUPPLIER', 'SUPER_ADMIN', 'BUILDER', 'ADMIN', 'FUND_MANAGER');
    `);

    // Add a new temp column with the enum type
    await queryInterface.addColumn('Users', 'userTypeTemp', {
      type: 'enum_Users_userType_fix_new',
      allowNull: true,
      defaultValue: null,
    });

    // // Copy over the old data to new column and cast to Enum values
    await queryInterface.sequelize.query(`
      UPDATE "Users"
      SET "userTypeTemp" = CASE
        WHEN "userType" = 'VENDOR' THEN CAST('SUPPLIER' AS enum_Users_userType_fix_new)
        WHEN "userType" = 'SUPER_ADMIN' THEN CAST('SUPER_ADMIN' AS enum_Users_userType_fix_new)
        WHEN "userType" = 'BUILDER' THEN CAST('BUILDER' AS enum_Users_userType_fix_new)
        WHEN "userType" = 'ADMIN' THEN CAST('ADMIN' AS enum_Users_userType_fix_new)
        WHEN "userType" = 'FUND_MANAGER' THEN CAST('FUND_MANAGER' AS enum_Users_userType_fix_new)
      END;
    `);

    // Remove the old column
    await queryInterface.removeColumn('Users', 'userType');

    // Rename the temporary column
    await queryInterface.renameColumn('Users', 'userTypeTemp', 'userType');
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
