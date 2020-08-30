const express = require('express');

const router = express.Router();

const Produto = require('../models/produto.model');

const connection = require('../config/connection');

router.get('/', async (req, res) => {

    const arrayProdutos = [];

    connection.query(

        'SELECT * FROM estoque_produto', (error, results, fields) => {
            if (error) throw error;

            results.forEach((raw_product) => {

                arrayProdutos.push(new Produto({
                    id: raw_product.id_produto,
                    nome: raw_product.nome_produto,
                    preco: raw_product.preco_produto,
                    descricao: raw_product.descricao_produto,
                    status: raw_product.status_produto
                }));
            });

            res.send(arrayProdutos);
        }
    )
});

router.post('/', async (req, res) => {

    let camposEsperados = ["name", "price", "status"];

    camposEsperados.forEach((campo, index) => {
        if (campo in req.body) {
            delete camposEsperados[index]
        }
    });

    camposEsperados = camposEsperados.filter((campo) => {
        return campo != null
    })

    if (camposEsperados.length > 0) {
        res.status(400)
        res.send({
            status: 400,
            message: `Campos ${camposEsperados} não enviados`
        })

    } else {
        connection.query(
            'INSERT INTO estoque_produto(nome_produto, preco_produto, descricao_produto, status_produto) VALUES (?, ?, ?, ?)',
            [req.body.name, req.body.price, req.body.description, req.body.status],

            (error, results, fields) => {
                if (error) res.send(error.code)
                res.send(new Produto({
                    id: results.insertId,
                    nome: req.body.name,
                    preco: req.body.price,
                    descricao: req.body.description,
                    status: req.body.status
                }))
            }
        )
    }
})

router.put('/:id', async (req, res) => {

    connection.query(
        'UPDATE estoque_produto SET nome_produto=?, preco_produto=?, descricao_produto=? WHERE id_produto=?',
        [req.body.name, req.body.price, req.body.description, req.params.id],

        (error, results, fields) => {
            if (error) res.send(error)
            res.send(new Produto({
                id: req.params.id,
                nome: req.body.name,
                preco: req.body.price,
                descricao: req.body.description
            }))
        }
    )

})

router.delete('/:id', async (req, res) => {

    connection.query(
        'UPDATE estoque_produto SET status_produto=? WHERE id_produto=?',
        [req.body.status, req.params.id],

        (error, results, fields) => {
            if (error) res.send(error.code)
            res.send('Produto alterado')
        }
    )
})

router.post('/entrada/:id', async (req, res) => {

    connection.query(
        'INSERT INTO estoque_entrada(produto_entrada, qtd_entrada) VALUES(?, ?)',
        [req.params.id, req.body.quantidade],

        (error, results, fields) => {
            if (error) res.send(error.code)
            res.send({
                id: req.params.id,
                quantidade: req.body.quantidade
            })
        }
    )
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