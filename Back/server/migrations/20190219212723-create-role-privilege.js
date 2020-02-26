'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('RolePrivileges', {
      Id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      Role: {
        type: Sequelize.INTEGER
      },
      Privilege: {
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
    }).then(function () {
      queryInterface.bulkInsert('RolePrivileges', [
        {
          Role: 1,
          Privilege: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Role: 2,
          Privilege: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Role: 2,
          Privilege: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Role: 3,
          Privilege: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Role: 3,
          Privilege: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Role: 3,
          Privilege: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ])
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('RolePrivileges');
  }
};