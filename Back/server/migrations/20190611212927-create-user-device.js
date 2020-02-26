'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserDevices', {
      Oid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      User: {
        type: Sequelize.UUID
      },
      Type: {
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
    return queryInterface.dropTable('UserDevices');
  }
};