const Sequelize = require('sequelize')
console('dbpw: {}', process.env.DBPW)
const db = new Sequelize('postgres', 'postgres', process.env.DBPW, {
    dialect: 'postgres'
  }
)
module.exports = db
