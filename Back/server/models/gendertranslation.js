'use strict';
module.exports = (sequelize, DataTypes) => {
  const GenderTranslation = sequelize.define('GenderTranslation', {
    Id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    Gender: DataTypes.INTEGER,
    Language: DataTypes.INTEGER,
    DisplayText: DataTypes.STRING
  }, {});
  GenderTranslation.associate = function(models) {
    // associations can be defined here
  };
  return GenderTranslation;
};