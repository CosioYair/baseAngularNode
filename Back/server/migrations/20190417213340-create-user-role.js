'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(() =>{
      queryInterface.createTable('UserRoles', {
        Oid: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()')
        },
        User: {
          type: Sequelize.UUID
        },
        Role: {
          type: Sequelize.INTEGER
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }).then(async function () {
        const User = require('../models').User;
        const UserOid = await User.findOne({ where: { IdentityConfirmed: true } })
        queryInterface.bulkInsert('UserRoles', [
          {
            User: UserOid.Oid,
            Role: 3,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]);
      });
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserRoles');
  }
};