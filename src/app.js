// Importar o express
const express = require('express');

// Instância express
const app = express();

const bodyParser = require('body-parser')

// Apenas dados simples
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json()); // Apenas no formato json

const rotaProdutos = require('./routes/produto.route');

app.use('/produtos', rotaProdutos)

app.get('/', async(req, res, next) => {
    res.send('OK')
});

// Tratamento de erro
app.use((req, res, next) => {
    const error = new Error("Not found page");
    error.status = 404;
    res.status(404);
    next(error.message);
});


module.exports = app;