'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('RoleTranslations', {
      Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Role: {
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
      queryInterface.bulkInsert('RoleTranslations', [
        {
          Role: 1,
          Language: 1,
          DisplayText: 'Usuario',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Role: 1,
          Language: 2,
          DisplayText: 'User',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Role: 2,
          Language: 1,
          DisplayText: 'Administrador',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Role: 2,
          Language: 2,
          DisplayText: 'Admin',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Role: 3,
          Language: 1,
          DisplayText: 'Súper Administrador',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Role: 3,
          Language: 2,
          DisplayText: 'Super admin',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('RoleTranslations');
  }
};