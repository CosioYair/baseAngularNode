'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserFileTypes', {
      Oid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      User: {
        type: Sequelize.UUID
      },
      FileType: {
        type: Sequelize.INTEGER
      },
      Source: {
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserFileTypes');
  }
};