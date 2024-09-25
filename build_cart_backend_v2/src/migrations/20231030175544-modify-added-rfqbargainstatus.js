module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('RfqQuotes', 'rfqQuoteBargainStatus', {
      type: Sequelize.ENUM(
        'ACCEPTED',
        'DISABLED',
        'BLOCKED',
        'PENDING',
        'REJECTED',
      ),
      allowNull: false,
      defaultValue: 'DISABLED',
    });
    await queryInterface.addColumn('RfqQuotes', 'canBargain', {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('RfqQuotes', 'rfqQuoteBargainStatus');
    await queryInterface.removeColumn('RfqQuotes', 'canBargain');
  },
};
