var mysql = require('mysql');
var site = require('../system-config');

var databaseName = "currency_exchange"; //database name


var conn = mysql.createConnection(site.db);
conn.connect(function(err, result) {
    if (err) throw err;
    console.log("Database connected!");
    

    
    // start creating tables;
    
    if (conn.state == "connected") {


        //   create users table
        conn.query(`CREATE TABLE IF NOT EXISTS users (
            ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(1000),
            username VARCHAR(1000),
            password VARCHAR(2000),
            age INT,
            nationality VARCHAR(1000),
            status VARCHAR(1000) DEFAULT 'active',
            role VARCHAR(1000) DEFAULT 'user',
            picture VARCHAR(2000),
            date DATETIME DEFAULT NOW()
        );`, function (err, result) {
            if (err) throw err;
            console.log("User table created!");
          });


        //   create sessions table
        conn.query(`CREATE TABLE IF NOT EXISTS sessions (
            ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            secret_key VARCHAR(2000),
            date DATETIME DEFAULT NOW()
        );`, function (err, result) {
            if (err) throw err;
            console.log("Sessions table created!");
          });
        


        //   create ____________ table
        // conn.query(``, function (err, result) {
        //     if (err) throw err;
        //     console.log("Database created!");
        //   });
        } else {
            console.log("Database not connected...");
        }
});

    