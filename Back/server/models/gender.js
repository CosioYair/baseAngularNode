'use strict';
module.exports = (sequelize, DataTypes) => {
  const Gender = sequelize.define('Gender', {
    Id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    Name: DataTypes.STRING
  }, {});
  Gender.associate = function (models) {
    Gender.hasOne(models.User, { foreignKey: 'Gender' });
    Gender.belongsToMany(models.Language, { through: models.GenderTranslation, foreignKey: 'Gender' });
  };
  return Gender;
};