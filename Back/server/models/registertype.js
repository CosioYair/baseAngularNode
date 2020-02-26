'use strict';
module.exports = (sequelize, DataTypes) => {
  const RegisterType = sequelize.define('RegisterType', {
    Id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    Name: DataTypes.STRING,
    Description: DataTypes.STRING,
  }, {});
  RegisterType.associate = function (models) {
    RegisterType.belongsToMany(models.User, { through: models.UserRegisterType, foreignKey: 'RegisterType' });
  };
  return RegisterType;
};