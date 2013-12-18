define(function(require){

	var self = {};
	var our = {};

	var StacheBeamer = require("stache!html/game-text-beamer");

	// --- PUBLIC VARS ---
	self.name = "Text"

	// --- PUBLIC FUNCTIONS ---
	
	self.getInfo = function(args) {
		return args[0];
	};

	self.drawBeamer = function(gc){
		var ctx = {
			text : gc.getArg(0)
		};
		return $(StacheBeamer(ctx));
	};

	self.drawControl = function(gc) {
		var $el = $("<div>");
		$el.text(gc.getArgs()[0]);
		return $el;

	};

	return self;

});
