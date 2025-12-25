const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const table = {
  user: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  password:Sequelize.STRING,
};

module.exports = sequelize.define("login", table);;
