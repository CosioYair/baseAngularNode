'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Actions', {
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
      queryInterface.bulkInsert('Actions', [
        {
          Name: 'Email confirm',
          Description: 'EC',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Name: 'New email',
          Description: 'NE',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Name: 'New password',
          Description: 'NP',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Actions');
  }
};