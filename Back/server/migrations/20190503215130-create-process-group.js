'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ProcessGroups', {
      Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      GroupType: {
        type: Sequelize.INTEGER
      },
      Role: {
        type: Sequelize.INTEGER
      },
      StepOrdered: {
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
      queryInterface.bulkInsert('ProcessGroups', [
        {
          GroupType: 1,
          Role: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          GroupType: 1,
          Role: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ProcessGroups');
  }
};