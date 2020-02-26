'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
    Oid: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    User: DataTypes.UUID,
    Role: DataTypes.INTEGER
  }, {});
  UserRole.associate = function(models) {
    // associations can be defined here
  };
  return UserRole;
};