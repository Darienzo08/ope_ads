// Importar o express
const express = require('express');
const path = require('path');
// Instância express
const app = express();

const bodyParser = require('body-parser')

// Apenas dados simples
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static('ope_ads/src/client'));

app.use(bodyParser.json()); // Apenas no formato json

const rotaProdutos = require('./routes/produto.route');

app.use('/produtos', rotaProdutos)

app.get('/', async(req, res, next) => {

    res.sendFile(path.join(__dirname, '../src/client', 'index.html'))

});

module.exports = app;