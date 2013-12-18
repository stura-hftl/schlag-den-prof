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

			if(our.zoom)
				self.zoomToMarkers();
			

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

		/**
		* Returns the zoom level at which the given rectangular region fits in the map view. 
		* The zoom level is computed for the currently selected map type. 
		* @param {google.maps.Map} map
		* @param {google.maps.LatLngBounds} bounds 
		* @return {Number} zoom level
		**/
		getZoomByBounds = function(bounds){
		  var MAX_ZOOM = our.map.mapTypes.get( our.map.getMapTypeId() ).maxZoom || 21 ;
		  var MIN_ZOOM = our.map.mapTypes.get( our.map.getMapTypeId() ).minZoom || 0 ;

		  var ne = our.map.getProjection().fromLatLngToPoint( bounds.getNorthEast() );
		  var sw = our.map.getProjection().fromLatLngToPoint( bounds.getSouthWest() ); 

		  var worldCoordWidth = Math.abs(ne.x-sw.x);
		  var worldCoordHeight = Math.abs(ne.y-sw.y);

		  //Fit padding in pixels 
		  var FIT_PAD = 40;

		  for( var zoom = MAX_ZOOM; zoom >= MIN_ZOOM; --zoom ){ 
			  if( worldCoordWidth*(1<<zoom)+2*FIT_PAD < $(our.map.getDiv()).width() && 
				  worldCoordHeight*(1<<zoom)+2*FIT_PAD < $(our.map.getDiv()).height() )
				  return zoom;
		  }
		  return 0;
		};

		self.zoomToMarkers = function() {
			our.zoom = true;

			var b = new google.maps.LatLngBounds();

			if(our.markers.solution)
				b = b.extend(our.markers.solution.getPosition());

			if(our.markers.prof)
				b = b.extend(our.markers.prof.getPosition());

			if(our.markers.stud)
				b = b.extend(our.markers.stud.getPosition());

			var zoom = getZoomByBounds(b);

			our.map.setZoom(zoom-1);
			our.map.setCenter(b.getCenter());

			//our.map.panToBounds(b);

		};
		
		init();
		return self;

	};


	return pseudoClass;
});
