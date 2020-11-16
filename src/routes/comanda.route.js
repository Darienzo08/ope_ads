const express = require('express');

const router = express.Router();

const Comanda = require('../models/comanda.model');
const ComandaDAO = require('../controller/comanda.controller');

const connection = require('../config/connection');

router.get('/', async(req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');

    try {

        await new ComandaDAO(connection).listarComanda().then(ArrayComanda => res.send(ArrayComanda));
        
    } catch (e) {

        res.send(e)
        
    }

});

router.get('/itens/:id', async(req, res) => {

    try {

        await new ComandaDAO(connection).listarItensComanda(req.params.id).then(i => res.send(i));

    } catch (e) {

        res.send(e)
        
    }

});

router.post('/', async(req, res) => {

    try {

        const novaComanda = new Comanda(req.body)

        await new ComandaDAO(connection).cadastrarComanda(novaComanda).then(novaComanda => res.send(novaComanda));
        
    } catch (e) {

        res.send(e)
        
    }

});

router.post('/itens', async(req, res) => {

    try {

        await new ComandaDAO(connection).acrescentarComanda(req.body).then(addComanda => res.send(addComanda));
        
    } catch (e) {

        res.send(e)
        
    }

});

router.put('/:id', async(req, res) => {

    try {

        const comanda = new Comanda(await new ComandaDAO(connection).alterarComanda(req.params.id, req.body));
        
        res.send(comanda)

    } catch (e) {

        res.send(e)
        
    }

});

router.put('/finalizar/:id', async (req, res) => {

    try {

        const comanda = new Comanda(await new ComandaDAO(connection).finalizarComanda(req.params.id))

        res.send(comanda)

    } catch (e) {

        res.send(e)

    }

})


module.exports = router;