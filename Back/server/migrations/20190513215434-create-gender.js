'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Genders', {
      Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Name: {
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
      queryInterface.bulkInsert('Genders', [
        {
          Name: 'Male',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Name: 'Female',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Genders');
  }
};