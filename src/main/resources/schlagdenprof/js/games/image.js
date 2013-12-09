define(function(require){

    var self = {};
	var our = {};

	//var Tree = require("common/tree");
	//var Bindings = require("common/bindings");
	//var DataBus = require("common/databus");
	//var StacheControl = require("stache!html/game.score.control");
	var StacheBeamer = require("stache!html/game-image-beamer");

	// --- PRIVATE VARS ---

	// --- PUBLIC VARS ---
	self.name = "Image"


	// --- STATIC BLOCK ---


	// --- PUBLIC FUNCTIONS ---

    self.drawBeamer = function(gc){
		var ctx = {
			src : gc.getArg(0)
		};
		return $(StacheBeamer(ctx));

    };

	self.drawControl = function(gc) {

	};




    return self;


});
