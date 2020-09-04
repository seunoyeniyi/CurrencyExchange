var db = require('./db');

var is_logged = function(req, output) {
    var session = req.session;
    
    if (!session.secret_key) {
        output(false);
    } else {

        db.query("SELECT * FROM users INNER JOIN sessions ON users.ID=sessions.user_id AND sessions.secret_key=" + db.escape(session.secret_key), function(err, result) {
            if (err) throw err;

            if (Object.keys(result).length > 0) {
                output(true);output
            } else {
                output(false);
            }

        });

    }
};


module.exports = {
    is_logged: is_logged,
};