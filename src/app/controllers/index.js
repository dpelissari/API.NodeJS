// solucao para nao precisar importar arquivo por arquivo no arquivo principal (./index.js)

// importa o fs - Permite trabalhar com o file system do node
const fs = require('fs');

// importa o path - Permite trabalhar com caminhos de pastas
const path = require('path');

// exporta
module.exports = app => {
    fs
        .readdirSync(__dirname) // le este diretorio/pasta
        // filtra os arquivos que não comecam com " . " e que
        // não seja o arquivo (index), ou seja os controllers
        .filter(file => ((file.indexOf('.')) !== 0 && (file !== "index.js")))
        // percore os arquivos
        .forEach(file => require(path.resolve(__dirname, file))(app)); 
}