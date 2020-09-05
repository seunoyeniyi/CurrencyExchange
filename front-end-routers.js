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
    },
    profile: {
        name: "profile",
        title: "Profile"
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
    // add session variable to all pages;
    if (req.session) {
        res.locals.session = req.session;
    }
    // add current user data to all pages;
    guser.is_logged(req, function(x) {
        // user logged
        guser.current_user.logged = true;
        // user data
        if (x) {
            db.query("SELECT users.* FROM users INNER JOIN sessions ON users.ID=sessions.user_id AND sessions.secret_key=" + db.escape(req.session.secret_key), function(err, result) {
                if (err) throw err;
                for (var i in result[0]) {
                    if (i != "password")
                        guser.current_user[i] = result[0][i];
                }
                // continue next()
                next();
            });
        } else {
            // continue next()
            next();
        }
        // add the user data to all pages;
        res.locals.current_user = guser.current_user;
    });

});











// GET ROUTES
router.get('/', function(req, res) {
    res.render('front/index', {page: pages.home});
});
router.get('/login', function(req, res) {
    if (guser.current_user.logged) {
        res.redirect("/dashboard"); res.end();
    } else {
        if (req.query.redir) {
            res.render("front/login", {page: pages.login, redir: req.query.redir});
        } else {
            res.render("front/login", {page: pages.login});
        }
    }
    
});
router.get('/register', function(req, res) {
    res.render("front/register", {page: pages.register});
});
router.get('/dashboard', function(req, res) {
    if (guser.current_user.logged) {
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
router.get('/profile', function(req, res) {
    if (guser.current_user.logged) {
        res.render('front/profile', {page: pages.profile});
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

router.post('/profile', function(req, res) {
    if (guser.current_user.logged) {
        // user logged
        var form = req.body;
        var error = {};
        db.query("UPDATE users SET age=" + db.escape(form.age) + ", gender=" + db.escape(form.gender) + ", nationality=" + db.escape(form.nationality) + " WHERE ID=" + db.escape(guser.current_user.ID), function(err, result) {
            if (err) { throw err; error.system = true; }
            if (result.affectedRows < 1) error.message = "Unable to update your profile.";

            if (Object.keys(error).length > 0) {
                res.render("front/profile", {page: pages.profile, error: error});
            } else {
                guser.get_user(guser.current_user.ID, function(user) {
                    user.logged = true; //incase of render to pages;
                    // change password
                if (form["change-password"]) {
                    var oldPass = form["old-password"];
                    var newPass1 = form["new-password1"];
                    var newPass2 = form["new-password2"];
                    if (newPass1 != newPass2) error.password_confirm_error = true;
                    if (newPass1.length < 5 || newPass2.length < 5) error.less_password = true;
    
                        gfunc.compare(oldPass, user.password, function(err, isMatch) {
                            if (!isMatch) error.old_password_error = true;
                            if (Object.keys(error).length > 0) {
                                res.render("front/profile", {page: pages.profile, current_user:user,  submitted: true, error: error});
                            } else {
                                // update password
                                gfunc.hash(newPass1, function(err, hash) {
                                    db.query("UPDATE users SET password=" + db.escape(hash) + " WHERE ID=" + db.escape(guser.current_user.ID), function(err, result) {
                                        if (err) throw err;
                                        if (result.affectedRows < 1) error.password_change_error = true;
                                        res.render("front/profile", {page: pages.profile, current_user:user, password_changed: (result.affectedRows > 0), submitted: true, error: error});
                                    });
                                });
                            }
                    });
                } else {
                    res.render("front/profile", {page: pages.profile, current_user: user, submitted: true});
                }
            });
            }
        });
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



module.exports = router;