'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('FileTypes', {
      Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Name: {
        type: Sequelize.STRING
      },
      Description: {
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
      queryInterface.bulkInsert('FileTypes', [
        {
          Name: 'IdentificationFront',
          Description: 'Identification photo. (Front)',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Name: 'IdentificationBack',
          Description: 'Identification photo (Back).',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Name: 'ProofOfAddress',
          Description: 'Proof of address photo..',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          Name: 'ProfilePic',
          Description: 'Profile photo.',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('FileTypes');
  }
};