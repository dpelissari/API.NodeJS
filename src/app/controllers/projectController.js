// importa o express
const express = require('express');

// importa o middleware
// https://expressjs.com/pt-br/guide/using-middleware.html
const authMiddleware = require('../middlewares/auth');


// importa o router do express
const router = express.Router();

// middleware específico para esta rota
router.use(authMiddleware);

// rota teste
router.get('/', (req,res) => {
    res.send({ ok: true})
});

// exporta a rota
module.exports = app => app.use('/projects', router);