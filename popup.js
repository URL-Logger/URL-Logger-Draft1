
$(function (){

    //Send login data
    var $username = $('#username');
    var $password = $('#password');
    $('#login').on('click', function() {
        var login_info = {
            username: $username.val(),
            password: $password.val()
        };
        console.log('Username: ' + login_info.username + ' Password: ' + login_info.password);

        //AJAX call goes here to send data to server API in order to validate login info
    });
});