var express = require('express');
var db = require('./db');
var bcript = require('bcryptjs');
var url = require('url');
var guser = require('./user-functions');
var gfunc = require('./functions');

// database collections


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
    // update session if cookie is set
    if (req.cookies.secret_key) {
        req.session.secret_key = req.cookies.secret_key;
    }

    // continue next()
    next();
});

// GET ROUTES
router.get('/', function(req, res) {
    res.render('front/index', {page: pages.home});
});
router.get('/login', function(req, res) {
    if (req.query.redir) {
        res.render("front/login", {page: pages.login, redir: req.query.redir});
    } else {
        res.render("front/login", {page: pages.login});
    }
    
});
router.get('/register', function(req, res) {
    res.render("front/register", {page: pages.register});
});
router.get('/dashboard', function(req, res) {
        guser.is_logged(req, function(x) {
            if (x) {
                res.render('front/dashboard', {page: pages.dashboard});
            } else {
                res.redirect(url.format({
                    pathname: "/login",
                    query: {
                        "redir": req.url
                    }
                }));
                res.end();
            }
            
        });
});

// POST ROUTES
router.post('/register', function(req, res) {
    var form = req.body;
    var error = {};
    // search user by username and email
    db.query("SELECT * FROM users WHERE username=" + db.escape(form.username) + " OR email=" + db.escape(form.email), function(err, result) {
        if (err) { error.system = true; throw err; }

        if (Object.keys(result).length > 0) {
            for (var i = 0; i < Object.keys(result).length; i++) {
                if (result[i].username == form.username) error.username = "exist";
                if (result[i].email == form.email) error.email = 'exist';
            }//if username or email exist add to error
        }
        if (form.password.length < 5) error.password = "password_less";
        if (form.username.length < 3) error.username = "less_username";

        // if there is any error
        if (Object.keys(error).length > 0) {
            res.render('front/register', {page: pages.register, error: error, form: {
                username: form.username,
                email: form.email
            }});
        } else {
            //no error continue
            // hash password;
            gfunc.hash(form.password, function(err, password_hash) {
                if (err) throw err;

            db.query("INSERT INTO users (username, email, password) VALUES (" + db.escape(form.username) + ", " + db.escape(form.email) + ", " + db.escape(password_hash) + ")", function(err, result) {
                if (err) { error.system = true; throw err; }
                // check if record inserted
                if (!result.affectedRows) { //if nothing is inserted
                    error.system = true;
                    res.render('front/register', {page: pages.register, error: error, form: {
                        username: form.username,
                        email: form.email
                    }});
                } else {
                    //update user if user ID is 1 - user role = super-admin
                    if (result.insertId == 1) {
                        db.query("UPDATE users SET role='super-admin' WHERE ID = 1", function(err, result) {
                            if (err) throw err;
                        });
                    }
                    // saved - save session, set session goto dashboard
                    // save session
                    gfunc.hash(Date.now(), function(err, secret_key) {
                        
                        db.query("INSERT INTO sessions (user_id, secret_key) VALUES (" + db.escape(result.insertId) + ", " + db.escape(secret_key) + ")", function(err, result) {
                            if (err) throw err;
                        });

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
                    });
                }
            }); //insert user into database
        }); //pass word hash
        }


    });

});

router.post('/login', function(req, res) {
    var form = req.body;
    var error = {};

    db.query("SELECT * FROM users WHERE username=" + db.escape(form.user) + " OR email=" + db.escape(form.user), function(err, result) {
        if (err) { throw err; error.system = true; }
        if (Object.keys(result).length < 1) error.no_user = true;
        if (Object.keys(error).length > 0) {
            // error occured
            res.render('front/login', {page: pages.login, error: error, form: form});
        } else {
            // user is found now compare password
            gfunc.compare(form.password, result[0].password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    // password is correct
                    // save, set session and if remember is checked set cookie
                    gfunc.hash(Date.now(), function(err, secret_key) {
                        if (err) throw err;
                        
                        //clear user ID sessions
                        db.query("DELETE FROM sessions WHERE user_id=" + db.escape(result[0].ID));
                        // save session into db
                        db.query("INSERT INTO sessions (user_id, secret_key) VALUES (" + db.escape(result[0].ID) + ", " + db.escape(secret_key) + ")", function(err, result) {
                            if (err) throw err;
                        });
                        //set session
                        req.session.secret_key = secret_key;
                        // if remember is check, set cookie
                            if (form.remember) {
                                var d = new Date();
                                var exdays = 30;
                                res.cookie("secret_key", secret_key, {expire: d.getTime() + (exdays * 24 * 60 * 60 * 1000)});
                            }
                        if (form.redir) {
                            res.redirect(form.redir);
                        } else {
                            res.redirect('/dashboard?sign-in=1');
                        }
                        
                        res.end();
                    });

                } else {
                    error.password = "incorrect";
                    res.render('front/login', {page: pages.login, error: error, form: form});
                }
            });
        }
    });

});



module.exports = router;