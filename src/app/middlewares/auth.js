// importando o jason web socket (jwt)
const jwt = require('jsonwebtoken');

// importando a hash da aplicacao
const authConfig = require('../../config/auth.json');

module.exports = (req, res, next) => {
    // busca o header de autorizacao na requisicao
    const authHeader = req.headers.authorization;

    // verifica se o token foi informado
    if(!authHeader)
        return res.status(401).send({error: 'No token provided'});

    // verifica se o token está no formato correto
    const parts = authHeader.split(' ');
    // se tiver duas partes (ex: bearer, Akashas25151aadaw2 )  
    if(!parts.lenght == 2)
        return res.status(401).send({ error: 'Token error'});

    // se tiver duas partes destrutura o array
    // scheme = beares | token = token
    const [ scheme, token] = parts;
    
    // verifica se tem a palabra beaurer no token
    if(!/^Bearer$/i.test(scheme)){
        // se nao possuir a palavra bearer
        return res.status(401).send({ error: 'Token malFormated'});
    }

    // verifica se o token bate com o usuario que requisitou
    // err = Erro se possuir | decoded = Id do usuario
    jwt.verify(token, authConfig.secret, (err, decoded) => {
       if (err) return res.status(401).send({ error: 'Token invalid'});

       // se passou repassa o id para usar em qualquer funcao do controller
       req.userId = decoded.id;
       // passa para o prox
       next();
    })
}