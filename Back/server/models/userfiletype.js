'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserFileType = sequelize.define('UserFileType', {
    Oid: {
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID
    },
    User: {
      type: DataTypes.UUID
    },
    FileType: {
      type: DataTypes.INTEGER
    },
    Source: {
      type: DataTypes.STRING
    }
  }, {});
  UserFileType.associate = function(models) {
    
  };
  return UserFileType;
};