'use strict';
module.exports = (sequelize, DataTypes) => {
  const FileType = sequelize.define('FileType', {
    Id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    Name: {
      type: DataTypes.STRING
    },
    Description: {
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {});
  FileType.associate = function (models) {
    FileType.belongsToMany(models.User, { through: models.UserFileType, foreignKey: 'FileType' });
  };
  return FileType;
};