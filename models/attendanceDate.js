const sequelize = require("../util/database");
const Sequelize = require("sequelize");
const attendance = require("./attendance");

const table = {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  day:Sequelize.INTEGER,
  month:Sequelize.INTEGER,
  year:Sequelize.INTEGER,
};
module.exports = sequelize.define("attendanceDate", table);;
