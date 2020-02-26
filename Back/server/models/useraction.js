'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserAction = sequelize.define('UserAction', {
    Oid: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    User: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Action: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Token: {
      type: DataTypes.UUID
    },
    Active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    ExpDate: {
      type: DataTypes.DATE
    }
  }, {});
  UserAction.associate = function (models) {

  };
  return UserAction;
};