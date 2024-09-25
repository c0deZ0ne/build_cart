'use strict';

module.exports = {
  up: async (queryInterface) => {
    const roles = [
      {
        id: 'e6ba1636-b416-4ce3-9c02-fb7b60820e39',
        name: 'SUPER ADMIN',
        description: 'Super Admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '69815383-18b3-4481-bae4-b40104ce5f4c',
        name: 'ADMIN',
        description: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '268d302d-4075-425b-93b8-a1437bc5ae8a',
        name: 'ACCOUNTANT',
        description: 'Accountant',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '8e2cec58-da77-48e4-ab98-ee955a4ae7a9',
        name: 'PROCUREMENT MANAGER',
        description: 'Procurement Manager',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await queryInterface.bulkInsert('Roles', roles);

    const superAdminRole = await queryInterface.rawSelect(
      'Roles',
      {
        where: { name: 'SUPER ADMIN' },
      },
      ['id'],
    );

    if (superAdminRole) {
      const users = await queryInterface.sequelize.query(
        `SELECT id FROM "Users";`,
      );

      const userRoles = users[0]?.map((user) => ({
        id: user.id,
        UserId: user.id,
        RoleId: superAdminRole,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      if (userRoles.length > 0) {
        await queryInterface.bulkInsert('UserRoles', userRoles);
      }

      await queryInterface.removeConstraint(
        'UserRoles',
        'UserRoles_UserId_fkey',
      );
      await queryInterface.addConstraint('UserRoles', {
        fields: ['UserId'],
        type: 'foreign key',
        name: 'UserRoles_UserId_fkey',
        references: {
          table: 'Users',
          field: 'id',
        },
        onDelete: 'CASCADE',
      });
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('UserRoles', null, {});
    await queryInterface.bulkDelete('Roles', null, {});

    await queryInterface.removeConstraint('UserRoles', 'UserRoles_UserId_fkey');
    await queryInterface.addConstraint('UserRoles', {
      fields: ['UserId'],
      type: 'foreign key',
      name: 'UserRoles_UserId_fkey',
      references: {
        table: 'Users',
        field: 'id',
      },
    });
  },
};
