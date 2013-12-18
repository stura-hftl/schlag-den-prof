define(function(require){
	var self = {};
	var our = {};

	// --- IMPORTS ---
	var Map = require("common/map");
	var StacheBeamer = require("stache!html/game-mappick-beamer");
	var StachePlayer = require("stache!html/game-mappick-player");
	var StacheMod = require("stache!html/game-mappick-mod");

	// --- STATIC BLOCK ---

	// --- PUBLIC FUNCTIONS ---
	self.name = "Map-Pick";

	self.getInfo = function(args) {
		var kwargs = args[0];
		return kwargs.label;

	};

	self.tick = function(gc) {
		var display = gc.getState("display", "input");

		if(display == 'input')
			gc.sendState({display: 'output'});

		else if(display == 'output')
			gc.sendState({display: 'answer'})

		else {
			gc.sendState({display: null});
			return false;

		}

		return true;

	};


	self.drawBeamer = function(gc){
		var kwargs = gc.getArg(0);
		var display = gc.getState("display", "input");

		var map;

		if(our.lastBeamer && our.lastBeamer.gc.isSamePosition(gc)) {
			map = our.lastBeamer.map;

		} else {
			var $beamer = $(StacheBeamer());
			var $canvas = $beamer.find("#mappick_canvas");
			map = Map($canvas, kwargs.bounds);

			our.lastBeamer = {
				gc: gc,
				"$el": $beamer,
				map : map,
				$text : $beamer.find("#mappick-title"),
				$dProf: $beamer.find("#mappick-prof"),
				$dStud: $beamer.find("#mappick-stud"),
			};
			our.lastBeamer.$text.html(kwargs.label);

		}

		map.hideMarker("solution");
		map.hideMarker("prof");
		map.hideMarker("stud");
		
		var inputs = gc.getState("input", {});

		switch(display) {
			case 'answer':
				var latlng = new google.maps.LatLng(kwargs.target[0], kwargs.target[1]);
				var latlngP = new google.maps.LatLng(inputs.prof[0], inputs.prof[1]);
				var latlngS = new google.maps.LatLng(inputs.stud[0], inputs.stud[1]);

				map.setMarker("solution", kwargs.target[0], kwargs.target[1]);
				
				if(display == 'answer') {
					var dProf = google.maps.geometry.spherical.computeDistanceBetween(
							latlng, latlngP);
					var dStud = google.maps.geometry.spherical.computeDistanceBetween(
							latlng, latlngS);

					our.lastBeamer.$dProf.text("" + Math.round(dProf) + "m");
					our.lastBeamer.$dProf.show();
					our.lastBeamer.$dStud.text("" + Math.round(dStud) + "m");
					our.lastBeamer.$dStud.show();
				}
				else {
					our.lastBeamer.$dStud.hide();
					our.lastBeamer.$dProf.hide();

				}

				// no break!

			case 'output':
				map.setMarker("prof", inputs.prof[0], inputs.prof[1]);
				map.setMarker("stud", inputs.stud[0], inputs.stud[1]);
				our.lastBeamer.$text.hide();

				break;

			case 'input':
				our.lastBeamer.$text.show();

		};


		window.setTimeout(map.resize, 200);
		window.setTimeout(map.resize, 400);
		window.setTimeout(map.resize, 800);
		window.setTimeout(map.resize, 1600);

		return our.lastBeamer.$el;

	};

	self.drawPlayer = function(gc, player) {
		var kwargs = gc.getArg(0);
		var display = gc.getState("display", "input");

		if(display != "input") {
			our.lastInput = null;
			return "";
		}

		// don't redraw on same position
		if(our.lastInput && our.lastInput.gc.isSamePosition(gc))
			return our.lastInput.$el;


		var $input = $(StachePlayer());
		var $canvas = $input.find("#mappick_canvas");
		$input.find("#mappick-title").text(kwargs.label);

		map = Map($canvas, kwargs.bounds);
		map.setCenterMarker(player, function(e){
			var state = { input: {}};
			state.input[player] = [
				e.latLng.lat().toFixed(10),
				e.latLng.lng().toFixed(10)
			];
			gc.sendState(state);

		});

		window.setTimeout(map.resize, 200);
		window.setTimeout(map.resize, 400);
		window.setTimeout(map.resize, 800);
		window.setTimeout(map.resize, 1600);

		our.lastInput = {
			gc:gc,
			"$el": $input
		};

		return $input;

	};


	self.drawControl = function(gc) {
		var kwargs = gc.getArgs()[0];
		var ctx = {};
		ctx.label = kwargs.label;
		var $control = $(StacheMod(ctx));

		var $btns = $control.find("[data-display]");
		$btns.filter("[data-display='"+gc.getState("display", "input")+"']").
			addClass("btn-primary");

		$btns.click(function(){
			var $btn = $(this);
			var display = $btn.data("display");

			$btns.not($btn).removeClass("btn-primary");
			$btn.addClass("btn-primary");

			gc.sendState({
				display : display
			});

		});

		our.lastControl = {gc:gc, "$el": $control};
		return $control;

	};

	return self;

});
