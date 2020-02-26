'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('GenderTranslations', {
      Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Gender: {
        type: Sequelize.INTEGER
      },
      Language: {
        type: Sequelize.INTEGER
      },
      DisplayText: {
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
      queryInterface.bulkInsert('GenderTranslations', [
        {
          Gender: 1,
          Language: 1,
          DisplayText: 'Masculino',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Gender: 1,
          Language: 2,
          DisplayText: 'Male',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Gender: 2,
          Language: 1,
          DisplayText: 'Femenino',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Gender: 2,
          Language: 2,
          DisplayText: 'Female',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('GenderTranslations');
  }
};