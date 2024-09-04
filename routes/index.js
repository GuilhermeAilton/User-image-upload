var express = require('express');
var router = express.Router();
let User = require("../models/User");
const path = require('path');
const fs = require('fs');

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Guilherme' });
});

// GET new user page
router.get('/new', function(req, res) {
  User.findAll()
    .then(users => {
      res.render('new', { users: users });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Erro ao buscar usuários');
    });
});

// POST save user
router.post('/save', async function(req, res) {
    try {
        const { nome, idade, uf } = req.body;
        const imagem = req.files.imagem;
        const imagemNome = imagem.name;

        // Verifica se já existe um usuário com o mesmo nome
        const usuariosExistentes = await User.findAll({
            where: { nome: nome }
        });

        if (usuariosExistentes.length > 0) {
            return res.status(400).json('Usuário já existe');
        }

        // Cria um novo usuário e obtém o ID gerado
        const novoUsuario = await User.create({
            nome: nome,
            idade: idade,
            UF: uf,
            imagemUrl: '' // Inicialmente vazio, será atualizado depois
        });

        // Gera um diretório único para o usuário usando o ID
        const userDir = path.join(__dirname, '..', 'public', 'images', novoUsuario.id.toString());

        // Cria o diretório se não existir
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }

        // Define o caminho completo para o arquivo
        const uploadPath = path.join(userDir, imagemNome);

        // Move o arquivo para o diretório do usuário
        imagem.mv(uploadPath, async function(err) {
            if (err) {
                console.error('Erro ao mover o arquivo:', err);
                return res.status(500).send('Erro ao mover o arquivo');
            }

            // Atualiza o URL da imagem no banco de dados
            const imagemUrl = `/images/${novoUsuario.id}/${imagemNome}`;
            await novoUsuario.update({ imagemUrl: imagemUrl });

            // Redireciona após o arquivo ser movido com sucesso
            res.redirect('/new');
        });
    } catch (error) {
        console.error('Erro ao salvar o usuário:', error);
        res.status(500).send('Erro ao salvar o usuário');
    }
});

module.exports = router;

// POST delete user
router.post('/delete', function(req, res) {
  const id = req.body.id;

  User.destroy({
    where: { id: id }
  })
  .then(() => {
    console.log("Usuário excluído com sucesso");
    res.redirect('/new'); // Exemplo de redirecionamento para a lista de usuários
  })
  .catch(err => {
    console.error('Erro ao excluir o usuário:', err);
    res.status(500).send('Erro ao excluir o usuário');
  });
});

module.exports = router;
