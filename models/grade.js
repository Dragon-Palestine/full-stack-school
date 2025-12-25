const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const table = {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  hw:Sequelize.DOUBLE,
  mid:Sequelize.DOUBLE,
  final:Sequelize.DOUBLE,
};

module.exports = sequelize.define("grade", table);;
