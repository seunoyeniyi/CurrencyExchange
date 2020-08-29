var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');

// ROUTERS
var frontEnd = require('./front-end-routers.js');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(cookieParser);
app.use('/', frontEnd);

app.listen(80, function() {
    console.log("Server running at port 8080, http://localhost:8080 ...");
});
