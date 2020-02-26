'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserTfas', {
      Id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      User: {
        type: Sequelize.UUID
      },
      Tfa: {
        type: Sequelize.INTEGER
      },
      QrCode: {
        type: Sequelize.STRING(3000)
      },
      Secret: {
        type: Sequelize.STRING
      },
      Active: {
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserTfas');
  }
};