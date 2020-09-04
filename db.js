var mysql = require('mysql');
var databaseName = "currency_exchange";
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: databaseName
});
conn.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
});

module.exports = conn;