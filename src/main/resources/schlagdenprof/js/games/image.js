define(function(require){

    var self = {};
	var our = {};

	//var Tree = require("common/tree");
	//var Bindings = require("common/bindings");
	//var DataBus = require("common/databus");
	//var StacheControl = require("stache!html/game.score.control");
	var StacheBeamer = require("stache!html/game-image-beamer");

	// --- PRIVATE VARS ---
	our.$beamer = $(StacheBeamer());
	our.$container = our.$beamer.find("[data-content='images']");
	our.pred = {};

	// --- PUBLIC VARS ---
	self.name = "Image"


	// --- STATIC BLOCK ---

	// --- PUBLIC FUNCTIONS ---

    self.drawBeamer = function(gc){
		var width = (100 / gc.getArgs().length)-3;

		var curr = {};
		var $toHide = our.$container.find("div");

		$.each(gc.getArgs(), function(i, src){
			var css = {
				width: (width-2)+"%",
				left: (i*width+1)+"%"
			};


			var $el;
			if(our.pred[src]) {
				$el = our.pred[src];
				$toHide = $toHide.not($el);
				$el.animate(css);

			} else {
				var $img = $("<img>");
				$img.attr("src", "/data/"+src);

				var $el = $("<div>");
				$el.css("position", "absolute");
				$el.css(css);
				$el.append($img);

				$el.hide();
				our.$container.append($el);
				$el.fadeIn();

			}

			curr[src] = $el;

		});

		$toHide.fadeOut();

		our.pred = curr;

		console.log(our.$beamer);
		return our.$beamer;

    };

	self.drawControl = function(gc) {

	};




    return self;


});
