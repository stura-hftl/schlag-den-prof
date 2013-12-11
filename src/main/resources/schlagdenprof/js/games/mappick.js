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

	self.drawBeamer = function(gc){

		var kwargs = gc.getArg(0);
		var $beamer = $(StacheBeamer());
		var $canvas = $beamer.find("#mappick_canvas");

		var map = Map($canvas, kwargs.bounds);
		map.setMarker("center", kwargs.target[0], kwargs.target[1]);

		window.setTimeout(map.resize, 200);
		window.setTimeout(map.resize, 400);
		window.setTimeout(map.resize, 800);
		window.setTimeout(map.resize, 1600);

		return $beamer;

	};

	self.drawControl = function(gc) {
		// don't redraw on same position
		if(our.lastControl && our.lastControl.gc.isSamePosition(gc))
			return our.lastControl.$el;

		var kwargs = gc.getArgs()[0];

		var ctx = {};
		ctx.label = kwargs.label;
		var $control = $(StacheMod(ctx));

		var $btns = $control.find("[data-display]");
		$btns.filter("[data-display='"+gc.getState("display", "title")+"']").
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
