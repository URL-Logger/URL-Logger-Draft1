function isNumber (o) {
  return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
}

$(function (){
    //Collect login data
    var $username = $('#username');
    var $password = $('#password');
    $('#login').on('click', function() {
		//Format login data
        var login_info = "user=" + $username.val() + "&" + "pass=" + $password.val();
        //POST - Send login data to server-side script for processing
        $.post(
			'http://Sample-env.zssmubuwik.us-west-1.elasticbeanstalk.com/login.php',	//WS URL
			login_info, 								//Login Data
			function (message) {						//Callback Success Function
				if (isNumber(message)) {
					chrome.storage.local.set({'ParticipantID': message});	//Save ParticipantID
					location.href = 'login_success.html';   //Transition to next page
					chrome.browserAction.setPopup({         
						popup: "login_success.html"			//Make the transition persistent
					});
				}	
			});
    });
});