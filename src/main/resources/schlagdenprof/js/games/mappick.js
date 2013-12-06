define(function(require){
	var self = {};
	var our = {};

	// --- IMPORTS ---
	var Map = require("common/map");
	var StacheBeamer = require("stache!html/game-mappick-beamer");

	// --- STATIC BLOCK ---

	// --- PUBLIC FUNCTIONS ---
	self.drawBeamer = function(args, state, data){

		var args = args[0];
		var $beamer = $(StacheBeamer());
		var $canvas = $beamer.filter("#mappick_canvas");

		var map = Map($canvas, args.bounds);
		map.setMarker("center", args.target[0], args.target[1]);

		window.setTimeout(map.resize, 200);

		return $beamer;

	};

	self.drawControl = function(data, step) {
	};


	return self;

});
