//The Model: All the data variables are declared here.

//Set the coordinates and names for the markers
var locations = [
	{title: 'Royal Opera House Muscat', location: {lat: 23.61406, lng: 58.468721}, image: 'img/rohm.jpg'},
	{title: 'InterContinental Hotel', location: {lat: 23.61614,lng: 58.46484}, image: 'img/intercon.jpg'},
	{title: 'Ramee Guestline Hotel Qurum', location: {lat: 23.627736,lng: 58.486457}, image: 'img/ramee.jpg'},
	{title: 'Crown Plaza Muscat', location: {lat: 23.6285,lng: 58.4834}, image: 'img/crown.jpg'},
	{title: 'Al-Qurm Park', location: {lat: 23.618652,lng: 58.489407 }, image: 'img/qpark.jpg'},
	{title: 'City Cinema Shatti', location: {lat: 23.61137,lng: 58.454019}, image: 'img/ccshatti.jpg'}
];

//array for markers
var markers = ko.observableArray();
var map;
//error handler for failed google api
function error_handler() {
  alert("The Google Maps API has failed. Please try again.");
}

function initMap() {
    //initalise the map
    map = new google.maps.Map(document.getElementById('map'), {
	    center: {lat: 23.621121, lng: 58.471593},
	    zoom: 15
	});

    //infowindow for each marker
	var infowindow = new google.maps.InfoWindow();
	
	//the View Model
    var ViewModel = function() {
    	var self = this;
    	self.location = ko.observableArray(locations);
    	self.value = ko.observable('');
    	for(var i = 0; i < locations.length; i++){
    		var position = locations[i].location;
    		var title = locations[i].title;
    		var image = locations[i].image;
    		//create a new marker
    		var marker = new google.maps.Marker({
	            map: map,
	            position: position,
	            title: title,
	            animation: google.maps.Animation.DROP,
	            image: image,
            }); 

    		// Create an onclick event to open an infowindow at each marker.
          	marker.addListener('click', function() {
            	populateInfoWindow(this, infowindow);
          	});
    		//Push the marker in the marker array
    		markers.push(marker);
    		
    	}
    	populateInfoWindow = function(marker,infowindow) {
    		var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title +'&format=json&callback=wikiCallback';
		    var wikiRequestTimeout = setTimeout(function(){
		    	alert("failed to get wikipedia resources")
		    }, 8000);
		    var articleStr;
    		var contentString = '<h3>' + marker.title + '</h3>' + '<img src="' + marker.image + '" height=\"100px\" width=\"200px\">' + '<br>';
    		$.ajax({
    			url: marker.url,
    			dataType: "jsonp",
    			//jsonp : "callback",
		    	success: function(response) {//response is a javascript object 
		    		var articleList = response[1];

		    		for(var i = 0; i < articleList.length; i++) {
		    			articleStr = articleList[i];
		    			var url = 'http://en.wikipedia.org/wiki/' + articleStr;
		    			contentString = contentString + '<a href=\"' + url + '\">' + url + '</a>' + '<br>';
		    		};
		    		//clearTimeout(wikiRequestTimeout);
		    	}
		    });

    		if (infowindow.marker != marker) {
				infowindow.marker = marker;
				marker.setAnimation(google.maps.Animation.BOUNCE);
        		setTimeout(function(){
          			marker.setAnimation(null);
        		}, 2000);
        		infowindow.setContent(contentString);
				infowindow.open(map, marker);
				// Make sure the marker property is cleared if the infowindow is closed.
				infowindow.addListener('closeclick',function(){
					infowindow.setMarker = null;
          		});
        	}
    	}
	  };

    ko.applyBindings(new ViewModel());
}