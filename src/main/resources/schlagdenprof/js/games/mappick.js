define(function(require){
	var self = {};
	var our = {};

	// --- IMPORTS ---
	var Map = require("common/map");
	var StacheBeamer = require("stache!html/game-mappick-beamer");
	var StacheMod = require("stache!html/game-mappick-mod");

	// --- STATIC BLOCK ---

	// --- PUBLIC FUNCTIONS ---
	self.name = "Map-Pick";

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
			map.setMarker("center", kwargs.target[0], kwargs.target[1]);

			our.lastBeamer = {
				gc: gc,
				"$el": $beamer,
				map : map
			};

		}


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

		var $input = $(StacheBeamer());
		var $canvas = $input.find("#mappick_canvas");

		map = Map($canvas, kwargs.bounds);
		map.setMarker("center", kwargs.target[0], kwargs.target[1]);

		window.setTimeout(map.resize, 200);
		window.setTimeout(map.resize, 400);
		window.setTimeout(map.resize, 800);
		window.setTimeout(map.resize, 1600);

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
