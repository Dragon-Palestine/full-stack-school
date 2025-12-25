const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const table = {
  id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  date:Sequelize.DATE,
};


module.exports = sequelize.define("registartion", table);;
