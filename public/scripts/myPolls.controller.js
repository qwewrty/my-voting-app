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
        var pollHTML = "<li><a href='/polls/"+poll._id+"'>"+poll.question+"</a><span id='res'><button class='btn btn-default'><a href='/results/"+poll._id+"'>View Results</a></button></span></li>";
        $('#list').append(pollHTML);
    }
}