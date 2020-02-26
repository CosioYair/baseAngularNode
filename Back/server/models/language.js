'use strict';
module.exports = (sequelize, DataTypes) => {
  const Language = sequelize.define('Language', {
    Id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    Name: DataTypes.STRING,
    DisplayText: DataTypes.STRING,
    Code: DataTypes.STRING
  }, {});
  Language.associate = function(models) {
    Language.belongsToMany(models.Role, { through: models.RoleTranslation, foreignKey: 'Language' });
    Language.belongsToMany(models.Gender, { through: models.GenderTranslation, foreignKey: 'Language' });
    Language.belongsToMany(models.Tfa, { through: models.TfaTranslation, foreignKey: 'Language' });
  };
  return Language;
};