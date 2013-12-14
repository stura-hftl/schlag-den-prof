define(function(require){

	var StacheText = require("stache!html/game-question-text");
	var StacheMod = require("stache!html/game-question-mod");

	var self = {};
	var our = {};

	self.drawOverlay = function(args, gc){
	};

	self.tick = function(gc) {
		var display = gc.getState("display", "question");

		if(display == 'question')
			gc.sendState({display: 'input'});

		else if(display == 'input')
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
		var question = gc.getArg(0);
		var answer = gc.getArg(1);

		var $el = $("<div>");
		$el.addClass("layer layer-crophud");

		var display = gc.getState("display", "question");
		var answers = gc.getState("input", {});

		switch(display) {
			case "answer":
				$el.prepend(
					$("<div>").
					addClass("layer layer-c layer-bigtext").
					text(answer)
				);

			case "output":
				$el.prepend(
					$("<div>").
					addClass("layer layer-w layer-text").
					text((answers.prof)?answers.prof:'')
				);
				$el.prepend(
					$("<div>").
					addClass("layer layer-e layer-text").
					text((answers.stud)?answers.stud:'')
				);
			case "input":
			case "question":
				$el.prepend(
					$("<div>").
					addClass("layer layer-n layer-text").
					text(question)
				);
				break;
				
		};

		return $el;

	};

	self.drawControl = function(gc){
		// don't redraw on same position
		//if(our.lastControl && our.lastControl.gc.isSamePosition(gc))
		//	return our.lastControl.$el;

		var kwargs = gc.getArgs()[0];
		var $control = $(StacheMod({
			question : gc.getArg(0),
			answer : gc.getArg(1)
		}));

		var $btns = $control.find("[data-display]");
		$btns.filter("[data-display='"+gc.getState("display", "question")+"']").
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


		our.lastControl = {gc:gc, "$el": $control}
		return $control;

	};

	self.drawPlayer = function(gc, player){
		var display = gc.getState("display", "question");

		if(display != "input"){
			our.lastInput = null;
			return "";
		}

		// don't redraw on same position
		if(our.lastInput && our.lastInput.gc.isSamePosition(gc))
			return our.lastInput.$el;


		var $el = $("<div>");
		var $input = $("<input>");

		$el.addClass("layer layer-c layer-input");
		$el.css("height", "200px");
		$el.append($input);

		$input.keyup(function(){
			var state = { input: {} };
			state.input[player] = $input.val();
			gc.sendState(state);
		});

		our.lastInput = {
			gc:gc,
			"$el": $el
		};
		
		return $el;

	};


	return self;

});
