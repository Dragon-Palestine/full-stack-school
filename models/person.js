const { toDefaultValue } = require("sequelize/lib/utils");
const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const table = {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name:Sequelize.STRING,
  age:Sequelize.INTEGER,
  phone:Sequelize.STRING,
  gender:Sequelize.STRING,
  email:Sequelize.STRING,
  role:{
    type:Sequelize.ENUM('admin','teacher','student'),
    allowNull:false,
  }
};

module.exports = sequelize.define("person", table);;
