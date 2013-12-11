define(function(require){

    var self = {};
	var our = {};

	var Tree = require("common/tree");
	var Bindings = require("common/bindings");
	var DataBus = require("common/databus");
	var StacheMod = require("stache!html/game-score-mod");
	var StacheControl = require("stache!html/game-score-control");
	var StacheBeamer = require("stache!html/game-score-beamer");
	var StacheOverlay = require("stache!html/game-score-overlay");
	var Audio = require("common/audio");

	// --- PRIVATE VARS ---

	our.score = {
	};

	var updateScore = function(action) {
		var path = "games."+DataBus.get("active")+".state.score.total";

		var scores = DataBus.get(path);

		if(!scores) scores = {};
		if(!scores.prof) scores.prof = 0;
		if(!scores.stud) scores.stud = 0;

		switch(action) {
			case "p+": scores.prof++; break;
			case "p-": scores.prof--; break;
			case "s+": scores.stud++; break;
			case "s-": scores.stud--; break;
		}

		DataBus.send(path, scores);
	};


	// --- PUBLIC VARS ---
	self.name = "Score"


	// --- STATIC BLOCK ---
	$(function(){
		$("body").keyup(function(e){
			switch(e.which){
				case 219: updateScore("p+"); break;
				case 79:  updateScore("p-"); break;
				case 68:  updateScore("s+"); break;
				case 65:  updateScore("s-"); break;
			}

			return false;
		});
	});

	// --- PUBLIC FUNCTIONS ---
	self.drawOverlay = function(args, gc){
		$el = $(StacheOverlay({round: gc.getRound()}));
		Bindings.rebind($el);
		return $el;

	};

    self.drawBeamer = function(gc){
		$el = $(StacheBeamer({ number : gc.getRound() }));
		Bindings.rebind($el);

        return $el;

    };

	self.drawControl = function(args, gc) {
		$el = $(StacheControl({ number : gc.getRound() }));
		Bindings.rebind($el);

		$el.find("[data-action]").click(function(){
			var $btn = $(this);
			var action = $btn.data("action");
			updateScore(action);

		});

        return $el;

	};




    return self;


});
