var express = require('express');
var app = express();
var path = require('path');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('front/index');
});

app.listen(3000, function() {
    console.log("Server running at port 3000, http://localhost:3000 ...");
});