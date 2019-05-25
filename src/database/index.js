const mongoose = require('mongoose');

// conect ao banco de dados
//mongoose.connect('mongodb://localhost/noderest', { useNewUrlParser:true });
mongoose.connect('mongodb://localhost/noderest', { useNewUrlParser: true, useCreateIndex: true, });

// indica a classe de promise que o mongoose vai usar
mongoose.promise = global.Promise;

module.exports = mongoose;