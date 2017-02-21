function sendCurrentUrl(userid, url, urlid, urlvid, urlrid) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", 'http://Sample-env.zssmubuwik.us-west-1.elasticbeanstalk.com/post_chrome.php', true);
	
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
		'&URLID=' + encodeURIComponent(urlid) +
		'&URLVID=' + encodeURIComponent(urlvid) +
		'&URLRID=' + encodeURIComponent(urlrid)); 
}

var visits = [];
var urls = [];

function genURLData() {
	// To look for history items visited in the last week,
	// subtract a week of microseconds from the current time.
	var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
	var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;

	// Track the number of callbacks from chrome.history.getVisits()
	// that we expect to get.  When it reaches zero, we have all results.
	var numRequestsOutstanding = 0;

	chrome.history.search({
		'text': '',              // Return every history item....
		'startTime': oneWeekAgo  // that was accessed less than one week ago.
	},
	function(historyItems) {
		// For each history item, get details on all visits.
		for (var i = 0; i < historyItems.length; ++i) {
			var url = historyItems[i].url;
			var processVisitsWithUrl = function(url) {
				// We need the url of the visited item to process the visit.
				// Use a closure to bind the  url into the callback's args.
				return function(visitItems) {
					processVisits(url, visitItems);
				};
			};
			chrome.history.getVisits({url: url}, processVisitsWithUrl(url));
			numRequestsOutstanding++;
		}
		if (!numRequestsOutstanding) {
			onAllVisitsProcessed();
		}
	});

	// Callback for chrome.history.getVisits().  Counts the number of
	// times a user visited a URL.
	var processVisits = function(url, visitItems) {
		for (var i = 0, ie = visitItems.length; i < ie; ++i) {
			urls.push(url);
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
		 for (var i = 0, ie = visits.length; i < ie; ++i) {
			var Data = '00000000001, ' + urls[i] + ', ' + visits[i].id + ', ' + visits[i].visitId + ', ' + visits[i].referringVisitId;
			//console.log(Data);
			//sendCurrentUrl('00000000001', urls[i], visits[i].id, visits[i].visitId, visits[i].referringVisitId);
        } 
    };
}

genURLData(); 