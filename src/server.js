const app = require('./app');
const http = require('http');
const port = 3389;

const server = http.createServer(app);

server.listen(port);