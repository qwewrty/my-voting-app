$(document).ready(function(){
    var count=3;
    $("#addOption").on('click', function(){
        $("#options").append('<div class="form-group"><label class="col-lg-2 control-label"></label><div class="col-lg-10"><input type="text" class="form-control"  name="op'+count+'" placeholder="Option '+count+' "></div></div>');
        count++;
    });
});