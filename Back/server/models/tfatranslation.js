'use strict';
module.exports = (sequelize, DataTypes) => {
  const TfaTranslation = sequelize.define('TfaTranslation', {
    Id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    Tfa: DataTypes.INTEGER,
    Language: DataTypes.INTEGER,
    DisplayText: DataTypes.STRING
  }, {});
  TfaTranslation.associate = function(models) {
    // associations can be defined here
  };
  return TfaTranslation;
};