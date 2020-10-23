const express = require('express');

const router = express.Router();

const Pratos = require('../models/estoqueItens.model');
const PratosDAO = require('../controller/pratos.controller');

const connection = require('../config/connection');

router.get('/', async(req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');

    try {

        await new PratosDAO(connection).listarPratos().then(ArrayPratos => res.send(ArrayPratos));
        
    } catch (e) {

        res.send(e)
        
    }

});

router.post('/', async(req, res) => {

    try {

        const novoPrato = new Pratos(req.body)

        await new PratosDAO(connection).cadastrarPratos(novoPrato).then(novoPrato => res.send(novoPrato));
        
    } catch (e) {

        res.send(e)
        
    }

});

router.put('/:id', async(req, res) => {

    try {

        const prato = new Pratos(await new PratosDAO(connection).alterarPratos(req.params.id, req.body));
        
        res.send(prato)

    } catch (e) {

        res.send(e)
        
    }

});

router.put('/inativar/:id', async (req, res) => {

    try {

        const prato = new Pratos(await new PratosDAO(connection).inativarPratos(req.params.id))

        res.send(prato)

    } catch (e) {

        res.send(e)

    }

})


module.exports = router;