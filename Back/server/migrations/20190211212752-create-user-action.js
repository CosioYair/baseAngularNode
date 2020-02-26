'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserActions', {
      Oid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      User: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      Action: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Token: {
        type: Sequelize.STRING
      },
      Active: {
        type: Sequelize.BOOLEAN
      },
      ExpDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserActions');
  }
};