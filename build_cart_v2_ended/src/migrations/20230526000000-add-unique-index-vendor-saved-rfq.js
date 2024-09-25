'use strict';
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addIndex(
      'VendorRfqRequests',
      ['VendorId', 'RfqRequestId'],
      {
        unique: true,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex('VendorRfqRequests', [
      'VendorId',
      'RfqRequestId',
    ]);
  },
};
