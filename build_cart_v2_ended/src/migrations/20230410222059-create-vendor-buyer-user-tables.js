'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Vendors', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tradingName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      businessSize: {
        type: Sequelize.ENUM('MICRO', 'SMALL', 'MEDIUM', 'LARGE'),
        allowNull: true,
      },
      registrationNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      categories: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
        defaultValue: [],
      },
      contactName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contactPhone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contactEmail: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      legalInfo: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      logo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      about: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      taxCompliance: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      racialEquity: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      termOfService: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('Buyers', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isIndividual: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },

      logo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      registrationNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      about: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('VENDOR', 'BUYER', 'ADMIN', 'SPONSOR'),
        allowNull: false,
      },
      level: {
        type: Sequelize.ENUM('ALPHA', 'BETA', 'OMEGA'),
        defaultValue: 'ALPHA',
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'PENDING', 'DISABLED', 'DEACTIVATED'),
        defaultValue: 'PENDING',
        allowNull: false,
      },
      VendorId: {
        type: Sequelize.UUID,
        references: {
          model: 'Vendors',
          key: 'id',
          onDelete: 'SET NULL',
        },
        allowNull: true,
      },
      BuyerId: {
        type: Sequelize.UUID,
        references: {
          model: 'Buyers',
          key: 'id',
          onDelete: 'SET NULL',
        },
        allowNull: true,
      },
      emailOtp: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      emailOtpExpiry: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      resetPasswordOtp: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      resetPasswordOtpExpiry: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      CreatedById: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
          onDelete: 'SET NULL',
        },
        allowNull: true,
      },
      UpdatedById: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
          onDelete: 'SET NULL',
        },
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable('Documents', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      VendorId: {
        allowNull: false,
        type: Sequelize.UUID,
        unique: true,
        references: {
          model: 'Vendors',
          key: 'id',
          onDelete: 'CASCADE',
        },
      },
      businessCertificate: {
        type: Sequelize.STRING,
      },
      vatCertificate: {
        type: Sequelize.STRING,
      },
      insuranceCertificate: {
        type: Sequelize.STRING,
      },
      proofOfIdentity: {
        type: Sequelize.STRING,
      },
      confirmationOfAddress: {
        type: Sequelize.STRING,
      },
      others: {
        type: Sequelize.JSON,
        defaultValue: {},
      },
      status: {
        type: Sequelize.ENUM('ACCEPTED', 'REJECTED', 'PENDING', 'REVIEW'),
        defaultValue: 'PENDING',
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Users');
    await queryInterface.dropTable('Documents');
    await queryInterface.dropTable('Vendors');
    await queryInterface.dropTable('Buyers');
  },
};
