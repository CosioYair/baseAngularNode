'use strict';
module.exports = (sequelize, DataTypes) => {
  const Privilege = sequelize.define('Privilege', {
    Id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    Name: DataTypes.STRING,
    Description: DataTypes.STRING,
    Code: DataTypes.STRING,
  }, {});
  Privilege.associate = function(models) {
    Privilege.belongsToMany(models.Role, { through: models.RolePrivilege, foreignKey: 'Privilege' });
  };
  return Privilege;
};