const Sequelize = require('sequelize')
console.info('dbpw: %s', process.env.DBPW)
const db = new Sequelize('postgres', 'postgres', process.env.DBPW, {
    dialect: 'postgres'
  }
)
module.exports = db
