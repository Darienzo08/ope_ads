const express = require('express');

const router = express.Router();

const Fornecedor = require('../models/fornecedor.model');
const FornecedorDAO = require('../controller/fornecedor.controller');

const connection = require('../config/connection');

router.get('/', async(req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');

    try {

        await new FornecedorDAO(connection).listarFornecedor().then(ArrayFornecedores => res.send(ArrayFornecedores));
        
    } catch (e) {

        res.send(e)
        
    }

});

router.post('/', async(req, res) => {

    try {

        const novoFornecedor = new Fornecedor(req.body)

        await new FornecedorDAO(connection).cadastrarFornecedor(novoFornecedor).then(novoFornecedor => res.send(novoFornecedor));
        
    } catch (e) {

        res.send(e)
        
    }

});

router.put('/:id', async(req, res) => {

    try {

        const fornecedor = new Fornecedor(await new FornecedorDAO(connection).alterarFornecedor(req.params.id, req.body));
        
        res.send(fornecedor)

    } catch (e) {

        res.send(e)
        
    }

});


module.exports = router;