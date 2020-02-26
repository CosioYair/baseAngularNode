'use strict';
module.exports = (sequelize, DataTypes) => {
  const Process = sequelize.define('Process', {
    Id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    Name: DataTypes.STRING,
    Description: DataTypes.STRING
  }, {});
  Process.associate = function (models) {
    Process.belongsToMany(models.ProcessGroup, { through: models.ProcessGroupCatalog, foreignKey: 'Process' });
  };
  return Process;
};