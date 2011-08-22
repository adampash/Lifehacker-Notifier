// console.log('loaded tweaks.js');
if (localStorage['lh_read_items'] == undefined) {
	localStorage['lh_read_items'] = '';
}
var lh_read_items = localStorage['lh_read_items'].split(',');

function sync_local_storage() {
	// console.log('send request');
	chrome.extension.sendRequest({'action' : 'sync_local_storage'}, function(response) {
		$.each(response, function(key, value) {
			localStorage[key] = value;
		})
	});
}

$('body').ready(function() {
	// console.log('doc is ready now');
	sync_local_storage();
	// Bind a change handler to the window location.
	$( window.location ).bind("change", function(e, data) {
		// // console.log(data.currentHref);
		add_item_to_read(data.currentHref); 
	});
	add_item_to_read(window.location.href);
	$('li.post').each(function(index, element) {
		var classes = $(element).attr('class');
		var id = '';
		if (classes.indexOf('postid_') != -1) {
			id = classes.split("postid_")[1].split(' ')[0]
		}
		// console.log(id);
		if (lh_read_items.indexOf(id) != -1) {
			mark_read(id);
		}
	});
});

function mark_read(id) {
	$('li.postid_' + id).addClass('read');
}

function add_item_to_read(url) {
	var post_id = url.split('/')[3];
	if (lh_read_items.indexOf(post_id) == -1) {
		localStorage['lh_read_items'] += ',' + post_id;
		lh_read_items = localStorage['lh_read_items'].split(',');
		mark_read(post_id);
	}
}


// history watch via http://www.bennadel.com/blog/1520-Binding-Events-To-Non-DOM-Objects-With-jQuery.htm

// Our plugin will be defined within an immediately
// executed method.
(function( $ ){
	// Default to the current location.
	var strLocation = window.location.href;
	var strHash = window.location.hash;
	var strPrevLocation = "";
	var strPrevHash = "";
 
	// This is how often we will be checkint for
	// changes on the location.
	var intIntervalTime = 100;
 
	// This method removes the pound from the hash.
	var fnCleanHash = function( strHash ){
	return(
	strHash.substring( 1, strHash.length )
	);
}
 
// This will be the method that we use to check
// changes in the window location.
var fnCheckLocation = function(){
	// Check to see if the location has changed.
	if (strLocation != window.location.href){
 
		// Store the new and previous locations.
		strPrevLocation = strLocation;
		strPrevHash = strHash;
		strLocation = window.location.href;
		strHash = window.location.hash;
 
		// The location has changed. Trigger a
		// change event on the location object,
		// passing in the current and previous
		// location values.
		$( window.location ).trigger(
		"change",
		{
			currentHref: strLocation,
			currentHash: fnCleanHash( strHash ),
			previousHref: strPrevLocation,
			previousHash: fnCleanHash( strPrevHash )
		}
		);
 
	}
}
 
// Set an interval to check the location changes.
setInterval( fnCheckLocation, intIntervalTime );
}
)( jQuery );