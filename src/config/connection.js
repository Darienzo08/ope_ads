const mysql = require('mysql');

const con = mysql.createConnection({
    host: "35.192.132.138",
    user: "ale",
    password: "alexandre2020",
    database: 'estoque'
});

con.connect();

module.exports = con;