'use strict';
const bcrypt = require('bcryptjs');
const models = require('../models');
const User = models.User;
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() => {
        queryInterface.createTable('Users', {
          Oid: {
            primaryKey: true,
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()')
          },
          Name: {
            type: Sequelize.STRING
          },
          Email: {
            type: Sequelize.STRING
          },
          Password: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          Gender: {
            type: Sequelize.INTEGER
          },
          Birthdate: {
            type: Sequelize.DATE
          },
          Phone: {
            type: Sequelize.STRING
          },
          NumExt: {
            type: Sequelize.STRING
          },
          NumInt: {
            type: Sequelize.STRING
          },
          Suburb: {
            type: Sequelize.STRING
          },
          Street: {
            type: Sequelize.STRING
          },
          Town: {
            type: Sequelize.STRING
          },
          State: {
            type: Sequelize.STRING
          },
          Country: {
            type: Sequelize.STRING
          },
          PostalCode: {
            type: Sequelize.STRING
          },
          TfaActive: {
            type: Sequelize.BOOLEAN
          },
          EmailConfirmed: {
            type: Sequelize.BOOLEAN
          },
          IdentityConfirmed: {
            type: Sequelize.BOOLEAN
          },
          Active: {
            type: Sequelize.BOOLEAN
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          }
        }).then(function () {
          queryInterface.bulkInsert('Users', [
            {
              Name: 'SuperAdmin',
              Email: 'ycosio@ai-blo.com',
              Password: bcrypt.hashSync('administrator', 10),
              IdentityConfirmed: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ])
        });
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};