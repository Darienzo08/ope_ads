const express = require('express');
const app = express();
const port = 3389;

app.get('/', async(req, res) => {
    res.send("Teste só para você ver que está funcionando")
});

app.listen(port);