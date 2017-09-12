var User = require("../models/Users");
var passport = require("passport");
var Poll = require("../models/Polls");
var localStrategy = require("passport-local").Strategy;

module.exports = function(app) {
    
    app.route('/').get(function(req,res) {
        res.sendFile(process.cwd() +'/public/index.html');
    });
    
    app.route('/register').get(function(req, res) {
        res.sendFile(process.cwd() + "/public/register.html");
    })
    
    app.route('/register').post(function(req, res){
        
        var name = req.body.name;
        var username = req.body.username;
        var password = req.body.password;
        var rePassword = req.body.repassword;
        
        if(name && username && password && rePassword==password) {
            var newUser = new User({
                name: name,
                username: username,
                password: password
            });
            
            User.createUser(newUser, function(err, user) {
                if(err) throw err;
                //console.log(user);
            });
            
            res.redirect('/login');
        }
    });
    
    
    passport.use(new localStrategy(
      function(username, password, done) {
        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'Unknown User'});
            }
            
            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                }
                else{
                    return done(null, false, {message: 'Invalid password!'})
                }
            })
        });
      }));
    
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
      User.findUserById(id, function(err, user) {
        done(err, user);
      });
    });
    
    app.route('/login').get(function(req, res){
        if(req.user){
            res.redirect('/vote');
        }
        res.sendFile(process.cwd()+'/public/login.html')
    });
    
    app.route('/login').post(passport.authenticate('local', {successRedirect: '/vote', failureRedirect:'/login', failureFlash: true, successFlash: 'You are Authenticated'}),
    function(req, res){
        res.cookie( 'name', req.user.name, {maxAge : 60000});
        res.redirect('/vote');
    });
    
    app.route('/logout').get(loggedIn, function(req, res) {
       req.logout(); 
       res.clearCookie('name');
       res.redirect('/');
    });
    
    app.route('/vote').get(loggedIn, function(req, res, next){
            res.cookie( 'name', req.user.name, {maxAge : 60000});
            res.redirect('/welcome/'+req.user.username); 
       
    });
    
    app.route('/welcome/:user').get(loggedIn, function(req,res){
       res.sendFile(process.cwd()+'/public/welcome.html'); 
    });
    
    app.route('/createPoll').get(loggedIn, function(req, res) {
        res.sendFile(process.cwd()+'/public/createPoll.html');
    });
    
    app.route('/createPoll').post(loggedIn, function(req, res) {
        
        var question = req.body.question;
        var username = req.user.username;
        var count=1;
        var options=[];
        var option="op1"
        while(req.body[option]){
            options.push(req.body[option]);
            count++;
            option="op"+count;
        }
        
        var votes = [];
        options.forEach(function(){
            votes.push(0);
        });
        
        if(username && question) {
            var newPoll = new Poll({
                question: question,
                username: username,
                options: options,
                votes: votes
            });
            
            Poll.createPoll(newPoll, function(err, poll) {
                if(err) throw err;
                console.log(poll);
            });
            
            res.redirect('/polls/'+username+'/'+encodeURIComponent(question));
        }
    });
    
    app.route('/polls/:username/:question').get(function(req, res) {
        var username = req.params.username;
        var question = decodeURIComponent(req.params.question);
        
        Poll.getPollByQuestion(username,question, function(err, poll){
            if(err) throw err;
            //console.log(poll);
            res.render('poll',{ question: poll.question, options: poll.options, poll_id: poll._id});
        });
    });
    
    app.route('/polls/:id').get(function(req, res) {
        var id = req.params.id;
        
        Poll.getPollById(id, function(err, poll){
            if(err) throw err;
            //console.log(poll);
            res.render('poll',{ question: poll.question, options: poll.options, poll_id: poll._id});
        });
    });
    
    app.route('/api/vote/:poll_id').post(function(req, res) {
        Poll.updateVotes(req.params.poll_id, req.body.option, function(err, poll){
            if(err) throw err;
            res.redirect('/results/'+poll._id);
        });
    });
    
    app.route('/api/getPolls').get(loggedIn, function(req, res) {
        
        Poll.getPollsByUser(req.user.username, function(err, data){
            if(err)
                console.log(err);
            res.send(JSON.stringify(data));
        });
    });
    
    app.route('/api/isValidUsername').get(function(req, res) {
        var username=req.query.username;
        //console.log(username);
        User.getUserByUsername(username,function(err, data){
            if(err)
                console.log(err);
            if(data)
                res.send("false");
            else
                res.send("true");
        });
    });
    
    app.route('/mypolls').get(loggedIn, function(req, res){
       res.sendFile(process.cwd()+'/public/myPolls.html'); 
    });
    
    app.route('/results/:poll_id').get(function(req, res) {
        Poll.getPollById(req.params.poll_id, function(err, poll){
            if(err) throw err;
            var chart_json = {
                type: 'doughnut',
                data: {
                  labels: poll.options,
                  datasets: [
                    {
                      label: "Votes",
                      backgroundColor: getRandomColorsArray(poll.options.length),
                      data: poll.votes
                    }
                  ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                  legend: { display: true },
                  title: {
                    display: true,
                    text: 'Voting Results',
                    fontSize: 20
                  }
                }
            }
            res.render('poll_results', { question: poll.question,
            chart: JSON.stringify(chart_json),
            helpers:{
                getVotes: function(index){return poll.votes[index];}    
            }})    
        });
    });
};
//https://angular-voting-app-qazxswedc.c9users.io/polls/acb/favorite%20anime%3F

function getRandomColorsArray(size) {
    var colors =[];
    for(var i=0; i<size; i++){
         colors.push(getRandomColor());   
    }
    return colors;
};

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return(color);
}

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}