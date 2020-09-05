var mysql = require('mysql');
var site = require('./system-config');


var conn = mysql.createConnection(site.db); //add system databse config

conn.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
});

module.exports = conn;