var express = require('express');
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




module.exports = router;