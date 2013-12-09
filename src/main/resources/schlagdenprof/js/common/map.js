define(function(require){

	var pseudoClass = function($canvas, bounds){
		var self = {};
		var our = {};

		// --- STATIC VARS ---
		our.styles = {};
		our.styles.running = [
			{ featureType: "poi",    stylers: [ { visibility: "off" } ] },
			{ elementType: "labels", stylers: [ { visibility: "off" } ] },
		];
		our.styles.finish = [];

		// --- PSEUDO CONSTRUCTOR ---
		// called at bottom
		var init = function() {
			our.$canvas = $canvas;

			our.bounds = new google.maps.LatLngBounds();
			our.bounds.extend(new google.maps.LatLng(bounds[0][0], bounds[0][1]));
			our.bounds.extend(new google.maps.LatLng(bounds[1][0], bounds[1][1]));

			our.map = new google.maps.Map(our.$canvas[0], {
				zoom: 20,
				center : our.bounds.getCenter(),
				mapTyoeId: google.maps.MapTypeId.ROADMAP,
				disableDefaultUI: true,
				draggable: false,
				styles: our.styles.running,
				scrollwheel: false,

			});



		};


		// --- PUBLIC FUNCTIONS ---
		self.resize = function(){
			// set bounds
			our.map.fitBounds(our.bounds);

			// WORKAROUND: Make sure google checks div resize.
			//             This might fail ...
			google.maps.event.trigger(our.map, "resize");
			

		}

		self.setMarker = function(key, lat, lng){
			var latlng = new google.maps.LatLng(lat, lng);
			var marker = new google.maps.Marker({
				position: latlng,
				draggable: true,
				icon: "img/mapmarkers/marker_solution.png"
			});
			marker.setMap(our.map);

		}
		
		init();
		return self;

	};


	return pseudoClass;
});
