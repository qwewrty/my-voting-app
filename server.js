var express = require("express");
var mongoose = require("mongoose");
var dotenv = require("dotenv");
var bodyParser = require("body-parser");
var flash = require("connect-flash");
var passport = require("passport");
var session = require("express-session");
var exphbs  = require('express-handlebars');
var cookieParser = require('cookie-parser');

var routes = require("./routes/index.js");

var db = 'mongodb://localhost:27017/voting';
var port = process.env.PORT || 8000;

var app = express();

dotenv.config({ verbose: true });

//Connect to mongo 
mongoose.connect(db, function(err) {
    if(err){
        console.log(err);
    }
});

mongoose.connection.on('connected', function() {
    console.log('Successfully opened a connection to '+db);
});

mongoose.connection.on('disconnected', function(){
    console.log('Disconnected from '+db);
});

mongoose.connection.on('error', function() {
    console.log('An error has occured!');
});

app.use('/controllers', express.static(process.cwd() + '/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

routes(app);

app.listen(port, function(){
    console.log("Listening on port :"+ port);
});