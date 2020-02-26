'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Processes', {
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
      queryInterface.bulkInsert('Processes', [
        {
          Name: 'CompleteRegister',
          Description: 'Set the basic user information',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          Name: 'KYC',
          Description: 'Set the KYC user information',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ])
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Processes');
  }
};