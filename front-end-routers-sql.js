var express = require('express');
var db = require('./db-sql');
var bcript = require('bcryptjs');
var url = require('url');
var guser = require('./user-functions-sql');
var conn = require('mysql');

// database collections


conn.createConnection({
    host: 'localhsot',
    user: 'root',
    password: '',
    database: 'currency_exchange'
});
conn.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
});


var router = express.Router();

var pages = {
    home: {
        name: "home",
        title: "Home"
    },
    login: {
        name: "login",
        title: "Login"
    },
    register: {
        name: "register",
        title: "Sign up"
    },
    dashboard: {
        name: "dashboard",
        title: "Dashboard"
    }
};

// MIDDLE WARES
router.use(function(req, res, next) {
    // add default page details to all page
    res.locals.page = {name: "", title: ""};
    next();
});

// GET ROUTES
router.get('/', function(req, res) {
    res.render('front/index', {page: pages.home});
});
router.get('/login', function(req, res) {
    res.render("front/login", {page: pages.login});
});
router.get('/register', function(req, res) {
    res.render("front/register", {page: pages.register});
});
router.get('/dashboard', function(req, res) {
        console.log(guser.is_logged(req));
        res.render('front/dashboard', {page: pages.dashboard});
});

// POST ROUTES
router.post('/register', function(req, res) {
    var form = req.body;
    var error = {};
    
    Users.find({ $or: [{'username': form.username}, {'email': form.email}]}, function(err, response) {
        if (err) {
            error.db = "find_error";
            error.system = true;
            console.log('Sign up error, Finding error');
            res.render('front/register', {page: pages.register, error: error, form: { username: form.username, email: form.email }});
        } else {
        if (response.length > 0) {
            for (var i = 0; i < response.length; i++) {
                if (response[i].username == form.username) error.username = "exist";
                if (response[i].email == form.email) error.email = 'exist';
            }
        }

        // if any error occur on user input
        if (Object.keys(error).length > 0) {
            res.render('front/register', {page: pages.register, error: error, form: {
                username: form.username,
                email: form.email
            }});
        } else {
            // login ready - insert into database, set session
            //inert into database
            var user = new Users({
                username: form.username,
                email: form.email,
                password: form.password,
                date: Date()
            });

            user.save(function(err, user) {
                if (err) {
                    console.log(err);
                    error.db = "insert_error";
                    error.system = true;
                    console.log("User sign up error, Insert error");
                    res.render('front/register', {page: pages.register, error: error, form: { username: form.username, email: form.email }});
                } else {
                    // saved - save session, set session goto dashboard
                    // save session
                    var secret_key = Date.now();
                    bcript.hash(Date.now(), 10, function(err, hash){ secret_key = hash; });
                    var newSession = new Sessions({
                        user_id: user._id,
                        secret_key: secret_key
                    });
                    newSession.save();
                    //set session
                    req.session.secret_key = secret_key;
                    // goto dashboard
                    res.redirect(url.format({
                        pathname: "/dashboard",
                        query: {
                            "sign-up": 1
                        }
                    }));


                    res.end();
                }

            });
        }

    }
    });

});

router.post('/login', function(req, res) {
    var form = req.body;
    var error = {};
    Users.findOne({ $or: [{'username': form.user}, {'email': form.user}]}, function(err, response) {
        if (err) error.system = true;
        
        if (!response) error.no_user = true;

        if (Object.keys(error).length > 0) {
            // error occured
            res.render('front/login', {page: pages.login, error: error, form: form});
        } else {
            // user is found now compare password
            response.comparePassword(form.password, function(err, isMatch) {
                if (error) error.system = true;
                if (isMatch) {
                    // save, set session and if remember is checked set cookie
                    var secret_key = Date.now();
                    bcript.hash(Date.now(), 10, function(err, hash){ secret_key = hash; });
                    // save session into db
                    var newSession = new Sessions({
                        user_id: response._id,
                        secret_key: secret_key
                    });
                    newSession.save();
                    //set session
                    req.session.secret_key = secret_key;
                    // if remember is check, set cookie

                    res.redirect('/dashboard?sign-in=1');
                    res.end();
                } else {
                    error.password = "incorrect";
                    res.render('front/login', {page: pages.login, error: error, form: form});
                }
            });
        }

    });

});



module.exports = router;