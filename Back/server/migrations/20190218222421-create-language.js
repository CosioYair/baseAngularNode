'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Languages', {
      Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Name: {
        type: Sequelize.STRING
      },
      DisplayText: {
        type: Sequelize.STRING
      },
      Code: {
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
      queryInterface.bulkInsert('Languages', [
        {
          Name: 'Spanish',
          DisplayText: 'Español',
          Code: 'es',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Name: 'English',
          DisplayText: 'English',
          Code: 'en',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Languages');
  }
};