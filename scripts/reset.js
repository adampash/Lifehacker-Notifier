// When you set most_recent from the home page, also set a from_home_page variable to true. 
// If a most_recent item isn't in the RSS feed but was set from the home page, keep badge 
// set to 0 and all items in the popup set to read. If most_recent *is* in the RSS feed, 
// set from_home_page to false and continue like normal. Also set from_home_page variable 
// to a timestamp, and if more than 3 hours has passed since that timestamp, set from_home_page to false

var counter_reset = '';
chrome.extension.sendRequest({'action' : 'counter_reset'}, function(response) {
	counter_reset = response;
	// console.log(counter_reset);
});

$(document).ready(function() {
	if (counter_reset == 'true') {
		// console.log('doc is ready now');
		// Bind a change handler to the window location.
		var id = '';
		if (window.location.host == 'lifehacker.com') {
			var most_recent = $('li.post').filter(":first");
			// // console.log(most_recent);
			var classes = $(most_recent).attr('class');
			if (classes.indexOf('postid_') != -1) {
				id = "Lifehacker-" + classes.split("postid_")[1].split(' ')[0]
			}
		}
		else if (window.location.host == 'blog.lifehacker.com') {
			var url = $('.post.top h1 a').attr('href');
			id = "Lifehacker-" + url.split('/')[3];
		}
		// // console.log(id);
		if (id != '') {
			chrome.extension.sendRequest({'action' : 'set_recent_from_homepage', 'id' : id}, function(response) {
				// console.log('set updated most_recent');
			});
		}	
	}
});
