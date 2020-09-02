var express = require('express');
var db = require('./db');


var Users = db.Users;
var Sessions = db.Sessions;



var is_logged = function(req) {
    var session = req.session;
    var returned = false;
    
    if (!session.secret_key) {
        returned = false;
    } else {
        var sess = Sessions.findOne({secret_key: session.secret_key}, function(err, response) {
            
            if (!response || err) {
                returned = false;
            } else {
                // get the user id
                var userID = response.user_id;
                var us = Users.findById(userID.toString(), function (err, response) {
                    if (!response || err) {
                        returned = false;
                    } else {
                        console.log("found true");
                        returned = true;
                    }
                    

                });
            }
        });

    }
    
    console.log("ready to send: ", returned);
    return "finshed";
};


module.exports = {
    is_logged: is_logged,
};