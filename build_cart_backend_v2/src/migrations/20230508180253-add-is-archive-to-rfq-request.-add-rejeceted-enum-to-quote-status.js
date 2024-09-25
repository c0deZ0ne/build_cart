module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('RfqRequests', 'isArchived', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('RfqRequests', 'isArchived');
  },
};
