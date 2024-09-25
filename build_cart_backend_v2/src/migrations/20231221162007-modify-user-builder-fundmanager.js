// migration file to rename the table
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.renameTable('Buyers', 'Builders');
    await queryInterface.renameTable('Sponsors', 'FundManagers');
    await queryInterface.renameTable('BuyerProjects', 'BuilderProjects');
    await queryInterface.renameTable('MySponsors', 'MyFundManagers');
    await queryInterface.renameTable('ProjectSponsors', 'ProjectFundManagers');
    await queryInterface.renameTable('BuyerSponsors', 'BuilderFundManagers');
  },

  down: async (queryInterface) => {
    // Revert the table name to the original name if needed
    await queryInterface.renameTable('Builders', 'Buyers');
    await queryInterface.renameTable('FundManagers', 'Sponsors');
    await queryInterface.renameTable('BuilderProjects', 'BuyerProjects');
    await queryInterface.renameTable('MyFundManagers', 'MySponsors');
    await queryInterface.renameTable('ProjectFundManagers', 'ProjectSponsors');
    await queryInterface.renameTable('BuilderFundManagers', 'BuyerSponsors');
  },
};
