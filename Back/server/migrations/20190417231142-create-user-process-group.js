'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserProcessGroups', {
      Oid: {
        primaryKey: true,
        type: Sequelize.UUID
      },
      User: {
        type: Sequelize.UUID
      },
      ProcessGroup: {
        type: Sequelize.INTEGER
      },
      Finished: {
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
    return queryInterface.dropTable('UserProcessGroups');
  }
};