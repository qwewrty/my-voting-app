$(document).ready(function(){
  if($.cookie("name")){
      $('#navbar-main').html('<ul class="nav navbar-nav nav-links"><li><a href="/myPolls">My Polls</a></li></ul><ul id="right-nav" class="nav navbar-nav navbar-right nav-links" style = "margin-right: 5px;"><li><a href="/logout" >Logout</a></li></ul>');
  }
  else{
      $('#navbar-main').html('<ul id="right-nav" class="nav navbar-nav navbar-right nav-links" style = "margin-right: 5px;"><li><a href="/login" >Login</a></li></ul><ul class="nav navbar-nav navbar-right nav-links"><li><a href="/register">Sign Up</a></li></ul>');
  }
});