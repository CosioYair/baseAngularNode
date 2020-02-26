'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tfa = sequelize.define('Tfa', {
    Id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    Name: DataTypes.STRING
  }, {});
  Tfa.associate = function (models) {
    Tfa.belongsToMany(models.User, { through: models.UserTfa, foreignKey: 'Tfa' });
    Tfa.belongsToMany(models.Language, { through: models.TfaTranslation, foreignKey: 'Tfa' });
  };
  return Tfa;
};