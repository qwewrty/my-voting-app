var mongoose = require('mongoose');
var bcrypt = require("bcrypt-nodejs");

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    name: {
        type: String
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt){
        if(err) throw err;
        bcrypt.hash(newUser.password, salt, null, function(err, hash){
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.findUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.comparePassword = function(password, hash, callback){
    bcrypt.compare(password, hash, function(err, isMatch){
        if(err) throw err;
        callback(null, isMatch);
    });
}