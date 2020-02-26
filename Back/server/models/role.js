'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    Id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    Name: DataTypes.STRING,
    Description: DataTypes.STRING
  }, {});
  Role.associate = function (models) {
    Role.belongsToMany(models.Privilege, { through: models.RolePrivilege, foreignKey: 'Role' });
    Role.belongsToMany(models.User, { through: models.UserRole, foreignKey: 'Role' });
    Role.belongsToMany(models.Language, { through: models.RoleTranslation, foreignKey: 'Role' });
    Role.hasMany(models.ProcessGroup, { foreignKey: 'Role' });
  };
  Role.prototype.getFormatedPrivileges = function () {
    return this.getPrivileges()
      .then(privileges => {
        return privileges.map(privilege => {
          const formatedPrivilige = {
            Id: privilege.Id,
            Name: privilege.Name,
            Description: privilege.Description,
            Code: privilege.Code
          };
          return formatedPrivilige;
        });
      });
  };
  return Role;
};