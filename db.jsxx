var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


mongoose.connect('mongodb://localhost/currency_exchange', {useNewUrlParser: true, useUnifiedTopology: true});

var SALT_WORK_FACTOR = 10;

// user database
var usersSchema = mongoose.Schema({
    username: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    age: Number,
    nationality: String,
    status: {type: String, default: 'active'},
    role: {type: String, default: 'user'},
    picture: String,
    date: {type: Date, defult: Date.now}
});
usersSchema.pre('save', function(next) {
    var user = this;

    //only hash the password if it is modified or new
    if (!user.isModified('password')) return next();

    //generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt;
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            // override the clear text password with the hashed one
            user.password = hash;
            next();
        });
    });
});

usersSchema.methods.comparePassword = function(userPassword, cb) {
    bcrypt.compare(userPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var Users = mongoose.model("Users", usersSchema);

// session table
var sessionSchema = mongoose.Schema({
    user_id: {type: String, required: true},
    secret_key: {type: String, required: true},
    date: {type: Date, default: Date.now()}
});
var Sessions = mongoose.model("Sessions", sessionSchema);




module.exports = {
    Users: Users,
    Sessions: Sessions
};