// importando o express
const express = require('express');

// importando o body-parser
const bodyParser = require('body-parser');

// instancia a aplicacao com o express
const app = express();

// para que a api entenda requisicoes em json
app.use(bodyParser.json());

// para que a api entenda parametros via url
app.use(bodyParser.urlencoded({ extended: false }));

// referencia o controller que responssavel por importar todos os outros controllers
require('./app/controllers/index')(app);

// porta que o servidor sera escutado
app.listen(4000);