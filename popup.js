
$(function (){

    //Format login data
    var $username = $('#username');
    var $password = $('#password');
    $('#login').on('click', function() {
        var login_info = "user=" + $username.val() + "&" + "pass=" + $password.val();

        console.log(login_info);

        //POST - Send login data to server-side script for processing
        $.post('http://Sample-env.zssmubuwik.us-west-1.elasticbeanstalk.com/login.php', login_info, function (message) {
            console.log(message);
            /*if(message == 1){
                /!*successPage();*!/
            }*/
        });
    });
    //Clear form elements when pressing 'clear'
    $('#clear').click(function () {
        $('.login-prompt')[0].reset();
    });
});

function successPage(){
    /*chrome.browserAction.setPopup({
        popup:"success.html"
    });*/
}
