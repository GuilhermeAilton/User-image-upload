const  Sequelize  = require('sequelize');

const sequelize = new Sequelize('form', 'root', 'admin', {
    host: 'localhost',
    dialect: 'mysql'
  });


  module.exports =sequelize