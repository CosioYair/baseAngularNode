'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserRegisterTypes', {
      Oid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      User: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      RegisterType: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Key: {
        type: Sequelize.STRING
      },
      AdditionalInfo: {
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
    return queryInterface.dropTable('UserRegisterTypes');
  }
};