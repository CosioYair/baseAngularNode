'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ProcessGroupCatalogs', {
      Id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      ProcessGroup: {
        type: Sequelize.INTEGER
      },
      Process: {
        type: Sequelize.INTEGER
      },
      Step: {
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
      queryInterface.bulkInsert('ProcessGroupCatalogs', [
        {
          ProcessGroup: 1,
          Process: 1,
          Step: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          ProcessGroup: 2,
          Process: 1,
          Step: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          ProcessGroup: 2,
          Process: 2,
          Step: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ProcessGroupCatalogs');
  }
};