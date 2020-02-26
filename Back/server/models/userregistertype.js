'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserRegisterType = sequelize.define('UserRegisterType', {
    Oid: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    User: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    RegisterType: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Key: DataTypes.STRING,
    AdditionalInfo: DataTypes.STRING
  }, {});
  UserRegisterType.associate = function (models) {

  };
  return UserRegisterType;
};