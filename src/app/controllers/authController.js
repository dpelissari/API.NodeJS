// importa o express
const express = require('express');

// importando o bcrypts - criptografia
const bcrypt = require('bcryptjs');

// importando o jason web socket (jwt)
const jwt = require('jsonwebtoken');

// importa o crypto - token
const crypto = require('crypto');

// importa o mailer
const mailer = require('../../modules/mailer');

// importando a hash da aplicacao
const authConfig = require('../../config/auth');

// importa o model USER
const User = require('../models/user');

// importa o router do express
const router = express.Router();

// gera o token
function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        // tempo de expiracao do token
        expiresIn: 86400
    } )
}

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
        return res.send({
            user,
            token: generateToken({ id: user.id}), 
            });
        // se nao conseguir, retorna o erro
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Registration failed' });
    }
});

// rota de autenticacao
router.post('/authenticate', async(req,res) => {
    // informacoes para validacao
    const { email, password } = req.body;

    // verifica se existe o usuario no banco de dados
    const user = await User.findOne( { email }).select('+password');

    // se não encontrar
    if (!user)
        return res.status(400).send({ error: 'User not found'});

    // verifica se a senha passada é a mesma cadastrada
    // bcrypt.compare é usado pois a senha foi criptografada

    if(!await bcrypt.compare(password, user.password)){

        // se as senhas forem iguais
        return res.status(400).send({ error: 'Invalid password'});

    }else
    {
        // não exibe a senha no retorno da requisicao
        user.password = undefined;

        // se as senhas estiverem corretas gera o token de autenticacao
        res.send( {
            user,
            token: generateToken({ id: user.id }), 
        });
    }      
})



// rota para recuperacao de senha
router.post('/forgot_password', async (req,res) => {
    // armazena o e-mail que o usuario quer recuperar a senha
    const { email } = req.body;

    try {
        // procura se o e-mail esta cadastrado na base de usuarios
        const user = await User.findOne({ email});

        // se nao encontrar o e-mail
        if(!user)
            return res.status(400).send({ error: 'User not found'});

        // gera o token que sera enviado por e-mail para resetar a senha
        const token = crypto.randomBytes(20).toString('hex');

        // tempo de expiracao do token
        const now = new Date(); 

        // pega o horario atual e adiciona uma hora para que o token expire
        now.setHours(now.getHours() + 1);

        // altera o usuario 
        await User.findByIdAndUpdate(user.id, {
            // quais campos serao setados
            '$set':{
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        } );

        mailer.sendMail({
            to: email,
            from: 'dpelissari1@gmail.com',
            template: 'auth/forgot_password',
            context: { token },

        }, (err) => {
            if(err)
                return res.status(400).send({ error: 'Cannot send forgot password email' });
                return res.send();
            })

    } catch (err) {
        console.log(err)
        res.status(400).send({ error: 'Error on forgot password, try again'});
    }

});

// rota para resetar a senha
router.post('/reset_password', async (req, res)=> {
    const { email, token, password} = req.body;

    try {
        // verifica se existe o usuario no banco de dados
        const user = await User.findOne( { email })
            .select('+passwordResetToken passwordResetExpires');
        
        // se não encontrar
        if (!user)
            return res.status(400).send({ error: 'User not found'});

        // se exister verifica se os tokens estao corretos
        if (token !== user.passwordResetToken)
           
            // se nao forem iguais
            return res.status(400).send({ error: 'Token invalid'});

            // verica se o token nao expirou
            if (now > user.passwordResetExpires)
                return res.status(400).send({ error: 'Token expired, generate a new one'});
        
                user.password = password;

                await user.save();

                // se for ok retorna 200
                res.send();
         
    } catch (err) {
        res.send(400).send({error: 'Cannot reset password, try again'});
    }
})

// recupera o app 
module.exports = app => app.use('/auth', router);