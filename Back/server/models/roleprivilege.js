'use strict';
module.exports = (sequelize, DataTypes) => {
  const RolePrivilege = sequelize.define('RolePrivilege', {
    Id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    Role: DataTypes.INTEGER,
    Privilege: DataTypes.INTEGER
  }, {});
  RolePrivilege.associate = function(models) {
    // associations can be defined here
  };
  return RolePrivilege;
};