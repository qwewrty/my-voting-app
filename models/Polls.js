var mongoose = require("mongoose");

var PollSchema = mongoose.Schema({
    question: {
        type: String
    },
    username: String,
    options: [String],
    votes: [Number]
});

var Poll = module.exports = mongoose.model('Poll', PollSchema);

module.exports.createPoll = function(newPoll, callback){
    newPoll.save(callback);
}

module.exports.getPollByQuestion = function(username, question, callback){
    var query = {question: question, username: username};
    var view = {__v:false};
    Poll.findOne(query, view, callback);
}

module.exports.getPollById = function(id, callback){
    var query = {_id: id};
    Poll.findOne(query, callback);
}

module.exports.updateVotes = function(id, option, callback){
    
    Poll.getPollById(id, function(err, poll)
    {
        if(err) throw err;
        //console.log(option);
        for(var i=0;i<poll.options.length;i++){
            if(poll.options[i]==option){
                poll.votes[i]++;
                //console.log(poll.options[i]+ " : "+ poll.votes[i]);
                break;
            }
        }
        //console.log(poll.votes);
    Poll.findByIdAndUpdate(poll._id, {$set:{votes:poll.votes}}, {new:true}, callback);
    });
}