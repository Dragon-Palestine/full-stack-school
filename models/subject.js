const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const table = {
  code: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  name:Sequelize.STRING,
  hours:Sequelize.INTEGER,
};

module.exports = sequelize.define("subject", table);;
