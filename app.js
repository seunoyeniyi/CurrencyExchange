var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');

var app = express();
var upload = multer();


// ROUTERS
var frontEnd = require('./front-end-routers.js');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for form urlecoded
app.use(upload.array()); //for parsing multipart/form-data
app.use(express.static(__dirname + '/public'));
app.use('/', frontEnd);

app.listen(80, function() {
    console.log("Server running at port 8080, http://localhost:8080 ...");
});
