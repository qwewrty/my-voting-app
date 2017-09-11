$(document).ready(function(){
    $("#signup").prop('disabled', true);
    $("#un").on("change",validateUsername);
    $("#rpass").on("change", validatePassword);
});

function validatePassword(){
    var password = $("#rpass").val();
    var pass=$("#pass").val();
    if(pass!=password){
        $("#errPass").html("Passwords do not match.");
    }else{
        $("#errPass").html("");
    }
}

function validateUsername(){
    var username = $("#un").val();
    var re = /[a-zA-Z0-9]/;
    if(re.test(username) && username.length < 4){
        $("#errun").html("Length must be greater than 5.");
    }
    else{
        $("#errun").html("");
        $.ajax({
            url: '/api/isValidUsername',
            data: {username: username},
            success: isValid
        });
    }
}

function isValid(data){
    if(data==="true"){
        $("#errun").html("");
        $("#signup").prop('disabled', false);
    }
    else{
        $("#errun").html("This username is taken please choose another.");
    }
}