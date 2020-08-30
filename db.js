var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/currency_exchange', {useNewUrlParser: true, useUnifiedTopology: true});


var usersSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    age: Number,
    nationality: String,
    status: String,
    role: String,
    picture: String,
});
var Users = mongoose.model("Users", usersSchema);




module.exports.Users = Users;