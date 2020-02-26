'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ActiveProcessGroups', {
      Oid: {
        primaryKey: true,
        type: Sequelize.UUID
      },
      ProcessGroupCatalog: {
        type: Sequelize.INTEGER
      },
      UserProcessGroup: {
        type: Sequelize.UUID
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
    return queryInterface.dropTable('ActiveProcessGroups');
  }
};