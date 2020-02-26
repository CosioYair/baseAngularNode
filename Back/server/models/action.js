'use strict';
module.exports = (sequelize, DataTypes) => {
  const Action = sequelize.define('Action', {
    Id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    Name: DataTypes.STRING,
    Description: DataTypes.STRING
  }, {});
  Action.associate = function(models) {
    Action.belongsToMany(models.User, { through: models.UserAction, foreignKey: 'Action' });
  };
  return Action;
};