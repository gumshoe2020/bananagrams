const Sequelize = require('sequelize')
const db = new Sequelize('bananagrams', 'bngrams', process.env.DBPW, {
    dialect: 'postgres'
  }
)
module.exports = db
