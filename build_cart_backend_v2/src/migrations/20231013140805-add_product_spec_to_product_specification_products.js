module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Populate new column
    await queryInterface.addColumn(
      'ProductSpecificationProducts',
      'product_spec',
      Sequelize.STRING,
    );

    const query = `
      UPDATE "ProductSpecificationProducts"
      SET product_spec = CONCAT("Products".name, ' ', "ProductSpecifications".value)
      FROM "Products", "ProductSpecifications"
      WHERE "ProductSpecificationProducts"."productId" = "Products".id AND "ProductSpecificationProducts"."productSpecificationId" = "ProductSpecifications".id
    `;
    await queryInterface.sequelize.query(query);
  },

  down: async (queryInterface, Sequelize) => {
    // If you want to revert the changes made by this migration, you can set the 'product_spec' column to NULL
    const query = `
      UPDATE "ProductSpecificationProducts"
      SET product_spec = NULL
    `;
    await queryInterface.sequelize.query(query);
  },
};
