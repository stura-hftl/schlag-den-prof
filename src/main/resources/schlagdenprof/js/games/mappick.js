define(function(require){
	var self = {};
	var our = {};

	// --- IMPORTS ---
	var StacheBeamer = require("stache!html/game-mappick-beamer");

	// --- PRIVATE VARS ---
	our.center = {
		latitude: 51.320833,
		longitude : 12.373611
	};
	our.center.latlng = new google.maps.LatLng(our.center.latitude,
					 					our.center.longitude);

	// --- PRIVATE FUNCTIONS ---
	var fixMapSize = function() {
		// WORKAROUND: Make sure google checks div resize.
		//             This might fail ...
		google.maps.event.trigger(our.map, "resize");
		our.map.setCenter(our.center.latlng);

	};

	
	// --- STATIC BLOCK ---

	// --- PUBLIC FUNCTIONS ---
	self.drawBeamer = function(args, state, data){
		if(!our.$beamer) {
			var styleArray = [
				{
					featureType: "poi",
					stylers: [
						{ visibility: "off" }
					]
				},
				{
					elementType: "labels",
					stylers: [
						{ visibility: "off" }
					]
				}
			];


			our.$beamer = $(StacheBeamer());
			our.$canvas = our.$beamer.filter("#mappick_canvas");
			our.map = new google.maps.Map(our.$canvas[0], {
					zoom: 15,
					center: our.center.latlng,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					disableDefaultUI: true,
					draggable: false,
					styles: styleArray
			});

			var myMarker = new google.maps.Marker({
					position: our.center.latlng,
					draggable: true
			});

			myMarker.setMap(our.map);

		}
		window.setTimeout(fixMapSize, 100);
		window.setTimeout(fixMapSize, 200);
		window.setTimeout(fixMapSize, 300);
		window.setTimeout(fixMapSize, 500);
		window.setTimeout(fixMapSize, 800);
		window.setTimeout(fixMapSize, 1300);

		return our.$beamer;

	};

	self.drawControl = function(data, step) {
	};


	return self;

});
