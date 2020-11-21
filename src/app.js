// Importar o express
const express = require('express');
const path = require('path');
// Instância express
const app = express();

const ProdutoDAO = require('../src/controller/produto.controller')

const connection = require('../src/config/connection');

const bodyParser = require('body-parser')

// Apenas dados simples
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static('src/client'));

app.use(bodyParser.json()); // Apenas no formato json

const rotaProdutos = require('./routes/produto.route');

app.use('/produtos', rotaProdutos);

const rotaFornecedores = require('./routes/fornecedor.route');

app.use('/fornecedores', rotaFornecedores);

const rotaComandas = require('./routes/comanda.route');

app.use('/comandas', rotaComandas);

const rotaPratos = require('./routes/pratos.route');

app.use('/pratos', rotaPratos)

const rotaDash = require('./routes/dashboard.route');

app.use('/dashboard', rotaDash)

app.get('/', async(req, res, next) => {

    res.sendFile(path.join(__dirname, '../src/client', 'index.html'))

});

app.post('/senha', async (req, res) => {

    try {

        const senha = await new ProdutoDAO(connection).gerarSenha(req.body.senha);

        res.send(senha)

    } catch (e) {

        res.send(e)
    }

})

app.post('/login', async (req, res) => {

    try {

        const login = await new ProdutoDAO(connection).realizarLogin(req.body.user, req.body.pwd);

        res.send(login)

    } catch (e) {

        res.status(404).send(e)
    }

})

app.post('/sessao', async (req, res) => {

    try {

        var token = req.header('Jwt');

        const sessao = await new ProdutoDAO(connection).validarSessao(token);

        res.send(sessao)

    } catch (e) {

        res.status(404).send(e)
    }

})

module.exports = app;