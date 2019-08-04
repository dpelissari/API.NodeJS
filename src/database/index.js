// importa o moongoose
const mongoose = require('mongoose');

// conecta ao banco de dados
mongoose.connect('mongodb://localhost/noderest', { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false  });

// indica a classe de promise que o mongoose vai usar
mongoose.promise = global.Promise;

// exporta
module.exports = mongoose;