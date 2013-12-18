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
		our.icons = {
			'prof': 'img/mapmarkers/marker_prof.png',
			'stud': 'img/mapmarkers/marker_student.png',
			'solution': 'img/mapmarkers/marker_solution.png'
		}
		our.markers = {};

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
				disableDoubleClickZoom: true

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

		self.setMarker = function(key, lat, lng, fn){
			var latlng = new google.maps.LatLng(lat, lng);
			var marker = new google.maps.Marker({
				position: latlng,
				draggable: true,
				icon: our.icons[key]
			});
			marker.setMap(our.map);

			our.markers[key] = marker;

			if(fn)
				google.maps.event.addListener(marker, 'dragend', fn);

		}

		self.setCenterMarker = function(key, fn) {
			var latlng = our.map.getCenter();

			var lat = latlng.lat();
			var lng = latlng.lng();

			self.setMarker(key, lat, lng, fn);

		}

		self.hideMarker = function(key) {
			if(our.markers[key]) {
				our.markers[key].setMap(null);
				our.markers[key] = null;
			}
		};

		self.setStyle = function(name) {
			our.map.setOptions({
				styles: our.styles[name]
			});
		};
		
		init();
		return self;

	};


	return pseudoClass;
});
