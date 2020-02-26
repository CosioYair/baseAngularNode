'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('TfaTranslations', {
      Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Tfa: {
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
      queryInterface.bulkInsert('TfaTranslations', [
        {
          Tfa: 1,
          Language: 1,
          DisplayText: 'Correo',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Tfa: 1,
          Language: 2,
          DisplayText: 'Email',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Tfa: 2,
          Language: 1,
          DisplayText: 'Autenticador de Google',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Tfa: 2,
          Language: 2,
          DisplayText: 'Google Authenticator',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('TfaTranslations');
  }
};