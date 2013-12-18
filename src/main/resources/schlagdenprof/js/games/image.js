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
	
	self.getInfo = function(args) {
		return args;
	};

    self.drawBeamer = function(gc){
		var width = (100 / gc.getArgs().length);

		var curr = {};
		var $toHide = our.$container.find("div");

		$.each(gc.getArgs(), function(i, src){
			var css = {
				width: (width-2)+"%",
				left: ((i*width)+1)+"%"
			};

			our.$container.height("auto");

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

				$el.css("opacity", 0);
				our.$container.append($el);

				var plainImage = new Image();
				plainImage.src = "/data/"+src;


				var height = function(){
					if(!plainImage.complete)
						window.setTimeout(height, 50);
					else {
						our.$container.height(plainImage.height);
						our.$container.css("max-height", "100%");

						$el.animate({opacity: 1})

						//$el.css("height", $el.height());
						//$el.css("max-height", "100%");

					}
				};

				height();


			}

			curr[src] = $el;

		});

		$toHide.hide();
		our.pred = curr;

		return our.$beamer;

    };

	self.drawControl = function(gc) {

	};




    return self;


});
