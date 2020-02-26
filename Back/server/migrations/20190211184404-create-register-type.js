'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('RegisterTypes', {
      Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Name: {
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
      queryInterface.bulkInsert('RegisterTypes', [
        {
          Name: 'Local',
          Description: 'LCL',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Name: 'Gmail',
          Description: 'GML',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Name: 'Facebook',
          Description: 'FBK',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('RegisterTypes');
  }
};