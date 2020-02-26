'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProcessGroup = sequelize.define('ProcessGroup', {
    Id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    GroupType: DataTypes.INTEGER,
    Role: DataTypes.INTEGER,
    StepOrdered: DataTypes.BOOLEAN
  }, {});
  ProcessGroup.associate = function (models) {
    ProcessGroup.belongsToMany(models.User, { through: models.UserProcessGroup, foreignKey: 'ProcessGroup' });
    ProcessGroup.belongsToMany(models.Process, { through: models.ProcessGroupCatalog, foreignKey: 'ProcessGroup' });
    ProcessGroup.belongsTo(models.Role, { foreignKey: 'Role', as: 'Roles' });
    ProcessGroup.belongsTo(models.GroupType, { foreignKey: 'GroupType', as: 'GroupTypes' });
  };
  ProcessGroup.prototype.getFormatedProcesses = async function (userProcessGroupOid) {
    const processes = await this.getProcesses();
    let formatedProcesses = [];
    await Promise.all(processes.map(async proccess => {
      const processGroupCatalogs = await proccess.ProcessGroupCatalog.getUserProcessGroups({
        through: {
          where: {
            UserProcessGroup: userProcessGroupOid
          }
        }
      });
      if (processGroupCatalogs[0]) {
        const activeProcessGroup = processGroupCatalogs[0].ActiveProcessGroup;
        const formatedProcess = {
          Oid: activeProcessGroup.Oid,
          Name: proccess.Name,
          Description: proccess.Description,
          Step: proccess.ProcessGroupCatalog.Step,
          Finished: activeProcessGroup.Finished
        };
        formatedProcesses.push(formatedProcess);
      }
    }));
    return formatedProcesses;
  };
  return ProcessGroup;
};