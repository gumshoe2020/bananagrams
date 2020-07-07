const Sequelize = require('sequelize')
const db = new Sequelize('postgres', 'postgres', 'UwdM71TnCQVP8nPO9', {
    dialect: 'postgres'
  }
)
module.exports = db
