var db = require('./db');

var is_logged = function(req, output) {
    var session = req.session;
    
    if (!session.secret_key) {
        output(false);
    } else {

        db.query("SELECT * FROM users INNER JOIN sessions ON users.ID=sessions.user_id AND sessions.secret_key=" + db.escape(session.secret_key), function(err, result) {
            if (err) throw err;

            if (Object.keys(result).length > 0) {
                output(true);
            } else {
                output(false);
            }

        });

    }
};

function get_user(id, user) {
    db.query("SELECT * FROM users WHERE ID=" + db.escape(id), function(err, result) {
        if (err) throw err;

        if (Object.keys(result).length > 0) {
            user(result[0]);
        } else {
            user(null);
        }

    });
}

var current_user = {};


module.exports = {
    is_logged: is_logged,
    current_user: current_user,
    get_user: get_user
};