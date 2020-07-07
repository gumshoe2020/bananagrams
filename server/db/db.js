const Sequelize = require('sequelize')
const db = new Sequelize('bananagrams', 'postgres', process.env.DBPW, {
    dialect: 'postgres'
  }
)
module.exports = db
