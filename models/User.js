const Sequelize  = require('sequelize');
const sequelize = require('../database/connection'); // ajuste o caminho conforme necessário

const Usuario = sequelize.define('Pessoa', {
  nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  idade: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  UF: {
    type: Sequelize.STRING(2), // O campo UF normalmente é representado por dois caracteres
    allowNull: false,
  },
  imagemUrl: {
    type: Sequelize.s=Sequelize.STRING, // 'long' permite armazenar imagens maiores
    allowNull: true,
  }
});

Usuario.sync({force:true})

module.exports = Usuario;
