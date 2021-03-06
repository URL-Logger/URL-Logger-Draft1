var visits = [];
var urls = [];
var titles = [];
var trans = [];
var ParticipantID = 0;
var myTimer1, myTimer2;
var myTimeout;

var microP1M = 1000 * 60;
var microP1H = 1000 * 60 * 60;
var microP1D = 1000 * 60 * 60 * 24;

function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth())
								 + "-" + twoDigits(this.getUTCDate()) 
								 + " " + twoDigits(this.getUTCHours()) 
								 + ":" + twoDigits(this.getUTCMinutes())
								 + ":" + twoDigits(this.getUTCSeconds());
};

$(function (){
	$('#SendData').on('click', function() {
		//if (ParticipantID != 0) genURLData(); 
		var hold = new Date();
		hold = hold.toMysqlFormat();
		var update_info = "partid=2&Timestamp=" + hold;
		$.post('http://Sample-env.zssmubuwik.us-west-1.elasticbeanstalk.com/postSync.php', update_info);
	});
	//Return to Login page
    $('#Logout').click(function (){
        logoutPage();
		clearTimeout(myTimeout);
    });
});

function logoutPage(){
    location.href = 'login.html';
    chrome.browserAction.setPopup({
        popup: "login.html"
    });
}

function sendCurrentUrl(userid, url, title, time, urlid, urlvid, urlrid, trans) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", 
		'http://Sample-env.zssmubuwik.us-west-1.elasticbeanstalk.com/post_chrome.php', true);
	
	//Send the proper header information along with the request
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	
	xhr.onreadystatechange = function() {//Call a function when the state changes.
		if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        // Request finished. Do processing here.
		}
	}
	
	xhr.send(
		'UserID=' + encodeURIComponent(userid) + 
		'&URL=' + encodeURIComponent(url) +
		'&Title=' + encodeURIComponent(title) +
		'&Timestamp=' + encodeURIComponent(time) +
		'&URLID=' + encodeURIComponent(urlid) +
		'&URLVID=' + encodeURIComponent(urlvid) +
		'&URLRID=' + encodeURIComponent(urlrid) +
		'&Transition=' + encodeURIComponent(trans)); 
}

function genURLData(time) {
	// To look for history items visited in the last week,
	// subtract the prefered time in microseconds from the current time.
	var timeAgo = (new Date).getTime() - time;

	// Track the number of callbacks from chrome.history.getVisits()
	// that we expect to get.  When it reaches zero, we have all results.
	var numRequestsOutstanding = 0;

	chrome.history.search({
		'text': '',              // Return every history item....
		'startTime': timeAgo  // that was accessed less than one week ago.
	},
	function(historyItems) {
		// For each history item, get details on all visits.
		for (var i = 0; i < historyItems.length; ++i) {
			var url = historyItems[i].url;
			var title = historyItems[i].title;
			var processVisitsWithUrl = function(url, title) {
				// We need the url of the visited item to process the visit.
				// Use a closure to bind the  url into the callback's args.
				return function(visitItems) {
					processVisits(url, title, visitItems);
				};
			};
			chrome.history.getVisits({url: url}, processVisitsWithUrl(url, title));
			numRequestsOutstanding++;
		}
		if (!numRequestsOutstanding) {
			onAllVisitsProcessed();
		}
	});

	// Callback for chrome.history.getVisits().  Counts the number of
	// times a user visited a URL.
	var processVisits = function(url, title, visitItems) {
		for (var i = 0, ie = visitItems.length; i < ie; ++i) {
			urls.push(url);
			titles.push(title);
			visits.push(visitItems[i]);
		}
		// If this is the final outstanding call to processVisits(),
		// then we have the final results.  Use them to build the list
		// of URLs to show in the popup.
		if (!--numRequestsOutstanding) {
			onAllVisitsProcessed();
		}
	};

	// This function is called when we have the final list of URls to display.
	var onAllVisitsProcessed = function() {
		var data = [];
		for (var i = 0, ie = visits.length; i < ie; ++i) {
			var form = {
				partid: ParticipantID, 
				url: urls[i], 
				title: titles[i], 
				time: visits[i].visitTime, 
				id: visits[i].id,
				vid: visits[i].visitId, 
				rid: visits[i].referringVisitId,
				tran: visits[i].transition
			};
			data.push(form);
		}
		
		data.sort(function(a, b) {
			return a.time - b.time;
		});
		
		for (var i = 0, ie = data.length; i < ie; ++i) { 
			var d = new Date(data[i].time);
			var send = d.toMysqlFormat();
			sendCurrentUrl(data[i].partid, data[i].url, 
						   data[i].title, send, data[i].id, 
						   data[i].vid, data[i].rid, data[i].tran);
        } 
    };
}

function program(time) {
	myTimeout = setTimeout(function(){ execute(time) }, time);
	console.log('why');
	
	
	
}

function execute(time) {
	genURLData(time);
	console.log("test");
	program(time);
}