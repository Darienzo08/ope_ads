const express = require('express');

const router = express.Router();

const connection = require('../config/connection');
const DashDao = require('../controller/dashboard.controller');

const DashboardDao = require('../controller/dashboard.controller')

router.get('/quantidade', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');

    try {

        await new DashboardDao(connection).listarQuantidadeProdutos().then(arrayQtdProduto => res.send(arrayQtdProduto));

    } catch (error) {

        res.send(error)
    }

})

router.get('/precos', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');

    try {

        await new DashboardDao(connection).listarPrecoTotalProduto().then(arrayPrecos => res.send(arrayPrecos));

    } catch (error) {

        res.send(error)
    }

})

router.get('/vendas', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');

    try {

        await new DashboardDao(connection).listarVendasTotal().then(arrayVendas => res.send(arrayVendas));

    } catch (error) {

        res.send(error)
    }

})

router.get('/recebido', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');

    try {

        await new DashboardDao(connection).listarValorRecebido().then(array => res.send(array));

    } catch (error) {

        res.send(error)
    }

})

router.get('/ultimos', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');

    try {

        await new DashboardDao(connection).listarUltimosProdutosComprados().then(array => res.send(array));

    } catch (error) {

        res.send(error)
    }

})

router.get('/limiar', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');

    try {

        await new DashboardDao(connection).listarProdutosAbaixoLimiar().then(array => res.send(array));

    } catch (error) {

        res.send(error)
    }

})

router.get('/gastos', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');

    try {

        await new DashboardDao(connection).listarValorGasto().then(array => res.send(array));

    } catch (error) {

        res.send(error)
    }

})

module.exports = router;