define(function(require){

	var self = {};
	var our = {};
	our.interval;

	//var StacheBeamer = require("stache!html/game-text-beamer");

	// --- PUBLIC VARS ---
	self.name = "Countdown"

	// --- PUBLIC FUNCTIONS ---
	self.drawBeamer = function(gc){
		duration = gc.getArg(0);

		var $el = $("<div>");
		$el.addClass("layer layer-c layer-bigtext");

		window.clearInterval(our.interval);

		$el.text(duration);

		our.interval = window.setInterval(function(){
			duration = duration - 0.1;

			$el.text(duration.toFixed(1));

			if(duration <= 0)
			{
				$el.text("0.0");
				window.clearInterval(our.interval);
			}

		}, 100);

		return $el;
	};

	self.drawControl = function(gc) {
	};

	return self;

});
