'use strict';
module.exports = (sequelize, DataTypes) => {
  const GroupType = sequelize.define('GroupType', {
    Id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    Name: DataTypes.STRING,
    Description: DataTypes.STRING
  }, {});
  GroupType.associate = function(models) {
    GroupType.hasMany(models.ProcessGroup, { foreignKey: 'GroupType' });
  };
  return GroupType;
};