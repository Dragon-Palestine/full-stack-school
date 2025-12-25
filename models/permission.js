const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const table = {
  id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  manageAdmin:Sequelize.BOOLEAN,
  manageTeacher:Sequelize.BOOLEAN,
  manageStudent:Sequelize.BOOLEAN,
  manageSubject:Sequelize.BOOLEAN,
  manageGrade:Sequelize.BOOLEAN,
  manageAttendance:Sequelize.BOOLEAN,
  assignSubjectToTeacher:Sequelize.BOOLEAN,
  assignSubjectToStudent:Sequelize.BOOLEAN,
  managePermission:Sequelize.BOOLEAN,
};


module.exports = sequelize.define("permission", table);;
