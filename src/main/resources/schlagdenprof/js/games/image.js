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
			images : []
		};

		var width = (100 / gc.getArgs().length)-3;

		$.each(gc.getArgs(), function(i, src){
			ctx.images[i] = {
				src : src,
				width : width
			};
		});


		return $(StacheBeamer(ctx));

    };

	self.drawControl = function(gc) {

	};




    return self;


});
