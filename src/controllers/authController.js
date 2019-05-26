// importa o express
const express = require('express');

// importa o model USER
const User = require('../models/user');

// importa o router do express
const router = express.Router();

// definindo rotas
router.post('/register', async (req, res) => {

    // armazena o conteudo da requisicao
    const { email } = req.body;

    // tenta criar um usuario quando chamar a rota
    try {
        // verifica se o e-mail já existe
        if (await User.findOne({ email })) return res.status(400).send({ error: 'Usear already exists' })

        // armazena todos os parametros da requisicao no User
        const user = await User.create(req.body);

        // define a senha como undefined para nao retornar nas requisicoes da api
        user.password = undefined;

        // retorna User
        return res.send({ user });

        // se nao conseguir, retorna o erro
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' });
    }
})

// recupera o app 
module.exports = app => app.use('/auth', router);