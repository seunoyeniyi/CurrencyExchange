var bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

// HASH A STRING
function hash(val, hash) {
    val = String(val);
    //generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) throw err;
        // hash the password using our new salt;
        bcrypt.hash(val, salt, function (err, key_hash) {
            if (err) {
                hash(err, null);
            } else {
                hash(null, key_hash);
            }
        });
    });
}

// COMPARE HASH
function compare(val, hash, result) {
        val = String(val);
        bcrypt.compare(val, hash, function (err, isMatch) {
            if (err) {
                result(err, null);
            } else {
                result(null, isMatch);
            }
        });
}

// VALIDATE EMAIL
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


module.exports = {
    hash: hash,
    compare: compare,
    validateEmail: validateEmail
}