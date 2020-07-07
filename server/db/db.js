const Sequelize = require('sequelize')
const db = new Sequelize('postgres', 'postgres', process.env.DBPW, {
    dialect: 'postgres'
  }
)
module.exports = db
