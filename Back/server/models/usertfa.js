'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserTfa = sequelize.define('UserTfa', {
    Id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    User: DataTypes.UUID,
    Tfa: DataTypes.INTEGER,
    QrCode: DataTypes.STRING,
    Secret: DataTypes.STRING,
    Active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
      defaultScope: {
        attributes: { exclude: ['User', 'createdAt', 'updatedAt'] },
      },
      scopes: {
        withSecret: {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        }
      },
  });
  UserTfa.associate = function (models) {
    // associations can be defined here
  };
  return UserTfa;
};