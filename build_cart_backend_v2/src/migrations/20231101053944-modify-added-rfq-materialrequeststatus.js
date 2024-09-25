module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('RfqRequestMaterials', 'canRecieveQuotes', {
      allowNull: true,
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'RfqRequestMaterials',
      'canRecieveQuotes',
    );
  },
};
