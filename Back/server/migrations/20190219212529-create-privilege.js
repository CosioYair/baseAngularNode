'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Privileges', {
      Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Name: {
        type: Sequelize.STRING
      },
      Code: {
        type: Sequelize.STRING
      },
      Description: {
        type: Sequelize.STRING
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
      queryInterface.bulkInsert('Privileges', [
        {
          Name: "UserPanel",
          Code: 'UP',
          Description: 'Access to user panel',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Name: "AdminPanel",
          Code: 'AP',
          Description: 'Access to admin panel',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Name: "ValidateIdentity",
          Code: 'VI',
          Description: 'Validation of identity user documents',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Name: "CreateAdmin",
          Code: 'CA',
          Description: 'Create new admins',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ])
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Privileges');
  }
};