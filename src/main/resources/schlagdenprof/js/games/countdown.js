define(function(require){

	var self = {};
	var our = {};
	our.interval;
	our.duration = 0;

	var StacheMod = require("stache!html/game-countdown-mod");

	// --- PUBLIC VARS ---
	self.name = "Countdown"

	// --- PUBLIC FUNCTIONS ---
	
	self.tick = function(gc) {
		var step = gc.getState("step", 1);

		if(step < 3)
			gc.sendState({step: step+1});
		else {
			gc.sendState({step: null});
			return false;
		}

		return true;
			
	};


	self.drawBeamer = function(gc){
		var step = gc.getState("step", 1);
		var delta = gc.getArg(1) || -0.1;

		if(step == 1)
			our.duration = gc.getArg(0);

		var $el = $("<div>");
		$el.addClass("layer layer-c layer-bigtext");

		window.clearInterval(our.interval);

		$el.text(our.duration.toFixed(1));

		if(step == 2)
		our.interval = window.setInterval(function(){
			our.duration = our.duration + delta;

			$el.text(our.duration.toFixed(1));

			if(our.duration <= 0)
			{
				$el.text("0.0");
				window.clearInterval(our.interval);
			}

		}, Math.abs(1000 * delta));

		return $el;
	};

	self.drawControl = function(gc) {
        var $control = $(StacheMod());

        var $btns = $control.find("[data-display]");
        $btns.filter("[data-display='"+gc.getState("step", 1)+"']").
            addClass("btn-primary");

        $btns.click(function(){
            var $btn = $(this);
            var step = $btn.data("display");

            $btns.not($btn).removeClass("btn-primary");
            $btn.addClass("btn-primary");

            gc.sendState({
                step : step
            });

        });


        return $control;

	};

	return self;

});
