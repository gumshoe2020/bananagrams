const Sequelize = require('sequelize')
console.info('dbpw: %s', 'UwdM71TnCQVP8nPO9')
const db = new Sequelize('postgres', 'postgres', process.env.DBPW, {
    dialect: 'postgres'
  }
)
module.exports = db
