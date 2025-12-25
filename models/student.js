const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const table = {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  hour:Sequelize.INTEGER,
};

module.exports = sequelize.define("student", table);;
