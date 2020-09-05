const express = require('express');

const router = express.Router();

const Produto = require('../models/produto.model');
const ProdutoDao = require('../controller/produto.controller')

const connection = require('../config/connection');

router.get('/', async (req, res) => {

    try {

        await new ProdutoDao(connection).listar().then(ArrayProdutos => res.send(ArrayProdutos))

    } catch (e) {

        res.send(e)

    }

});

router.post('/', async (req, res) => {

    try {

        const novoProduto = new Produto(req.body)

        await new ProdutoDao(connection).cadastrar(novoProduto).then(produto => res.send(produto))

    } catch (e) {

        res.send(e)

    }

})

router.put('/:id', async (req, res) => {

    try {

        const produto = new Produto(await new ProdutoDao(connection).alterar(req.params.id, req.body))

        res.send(produto)

    } catch (e) {

        res.send(e)

    }

})

router.delete('/:id', async (req, res) => {

    try {

        const produto = new Produto(await new ProdutoDao(connection).alterar_status(req.params.id))

        res.send(produto)

    } catch (e) {

        res.send(e)

    }

})

router.post('/entrada/:id', async (req, res) => {

    try {

        const qtdProduto = await new ProdutoDao(connection).entrada(req.params.id, req.body.quantidade)

        res.send(qtdProduto)

    } catch (e) {

        res.send(e)

    }

})

router.post('/saida/:id', async (req, res) => {

    connection.query(
        'INSERT INTO estoque_saida(produto_saida, qtd_saida) VALUES(?, ?)',
        [req.params.id, req.body.qtd],

        (error, results, fields) => {
            if (error) res.send(error.code)
            res.send({
                id: req.params.id,
                qtd: req.body.qtd
            })
        }
    )
})

module.exports = router;