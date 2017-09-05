$(document).ready(function(){
    $.ajax({
        url: '/api/getPolls',
        dataType: "json",
        success: loadPolls
    });
});
function loadPolls(data) {
    for(var i in data){
        var poll = data[i];
            //Have to add route /polls/pollId
        var pollHTML = "<li><a href='/polls/"+poll._id+"'>"+poll.question+"</a><button><a href='/results/"+poll._id+"'>View Results</a></button></li>";
        $('#polls').append(pollHTML);
    }
}