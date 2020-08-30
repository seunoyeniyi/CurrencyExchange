var express = require('express');
var db = require('./db');
var Users = db.Users;

var router = express.Router();

router.get('/', function(req, res) {
    res.render('front/index', {
        page: {
            name: "home",
            title: "Home"
        }
    });
});
router.get('/login', function(req, res) {
    res.render("front/login", {
        page: {
            name: "login",
            title: "Login"
        }
    });
});
router.get('/register', function(req, res) {
    res.render("front/register", {
        page: {
            name: "register",
            title: "Sign Up"
        }
    });
});

// POSTS ROUTES
router.post('/login', function(req, res) {
    res.send("Hello submitted");
    console.log(document.cookie);
});
router.post('/register', function(req, res) {
    var form = req.body;
    // console.log(form);
    Users.find(function(err, response) {
        console.log(response);
    });
    var user = new Users({
        username: form.username,
        email: form.email,
        passowrd: form.passowrd
    });

    // user.save(function (err, Users) { {
    //     if (err) 
    //         res.send('Database error');
    //     else
    //         res.send("Person added");

    // }});

    

    res.send("hello world");
});




module.exports = router;