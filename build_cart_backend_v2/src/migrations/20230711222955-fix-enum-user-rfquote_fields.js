/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Create a new enum type, make sure its name isn't the same as current column's enum type
    await queryInterface.sequelize.query(`
      CREATE TYPE enum_new_types_fix_new AS ENUM ('VENDOR', 'BUYER', 'ADMIN', 'SPONSOR');
    `);

    // Add a new temp column with the enum type
    await queryInterface.addColumn('Users', 'typeTemp', {
      type: 'enum_new_types_fix_new',
      allowNull: true,
      defaultValue: null,
    });

    // Copy over the old data to new column and cast to Enum values
    await queryInterface.sequelize.query(`
      UPDATE "Users"
      SET "typeTemp" = CASE
        WHEN "type" = 'VENDOR' THEN CAST('VENDOR' AS enum_new_types_fix_new)
        WHEN "type" = 'BUYER' THEN CAST('BUYER' AS enum_new_types_fix_new)
        WHEN "type" = 'ADMIN' THEN CAST('ADMIN' AS enum_new_types_fix_new)
      END;
    `);

    // Remove the old column
    await queryInterface.removeColumn('Users', 'type');

    // Rename the temporary column
    await queryInterface.renameColumn('Users', 'typeTemp', 'type');

    // Create a new enum type, make sure its name isn't the same as current column's enum type
    await queryInterface.sequelize.query(`
        CREATE TYPE enum_RfqQuotes_status_fix_new AS ENUM ('ACCEPTED', 'PENDING', 'REJECTED', 'CANCELLED');
      `);

    // Add a new temp column with the enum type
    await queryInterface.addColumn('RfqQuotes', 'statusTemp', {
      type: 'enum_RfqQuotes_status_fix_new',
      allowNull: true,
      defaultValue: null,
    });

    // Copy over the old data to new column and cast to Enum values
    await queryInterface.sequelize.query(`
        UPDATE "RfqQuotes"
        SET "statusTemp" = CASE
          WHEN "status" = 'ACCEPTED' THEN CAST('ACCEPTED' AS enum_RfqQuotes_status_fix_new)
          WHEN "status" = 'PENDING' THEN CAST('PENDING' AS enum_RfqQuotes_status_fix_new)
        END;
      `);

    // Remove the old column
    await queryInterface.removeColumn('RfqQuotes', 'status');

    // Rename the temporary column
    await queryInterface.renameColumn('RfqQuotes', 'statusTemp', 'status');
  },

  async down(queryInterface) {
    /**
     * Add reverting commands here.
     */
    await queryInterface.removeColumn('Users', 'typeTemp');

    /**
     * Add reverting commands here.
     */
    await queryInterface.removeColumn('RfqQuotes', 'statusTemp');
  },
};
