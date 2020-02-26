'use strict';
module.exports = (sequelize, DataTypes) => {
  const RoleTranslation = sequelize.define('RoleTranslation', {
    Id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    Role: DataTypes.INTEGER,
    Language: DataTypes.INTEGER,
    DisplayText: DataTypes.STRING
  }, {});
  RoleTranslation.associate = function(models) {
  };
  return RoleTranslation;
};