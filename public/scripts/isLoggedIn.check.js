$(document).ready(function(){
  if($.cookie("name")){
      $('#navbar-main').html('<ul class="nav navbar-nav nav-links"><li><a href="/myPolls">My Polls</a></li><li><a href="/createPoll">Create Poll</a></li></ul><ul id="right-nav" class="nav navbar-nav navbar-right nav-links" style = "margin-right: 5px;"><li><a href="/logout" >Logout</a></li></ul>');
  }
  else{
      $('#navbar-main').html('<ul id="right-nav" class="nav navbar-nav navbar-right nav-links" style = "margin-right: 5px;"><li><a href="/login" >Login</a></li></ul><ul class="nav navbar-nav navbar-right nav-links"><li><a href="/register">Sign Up</a></li></ul>');
  }
  
  if(getUrlParameter('t')){
    $("#loginerr").html("<p>Invalid Username or Password!</p>")
  }
});

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};