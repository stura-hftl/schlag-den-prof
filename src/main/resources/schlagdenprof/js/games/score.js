define(function(require){

    var self = {};
	var our = {};

	var Tree = require("common/tree");
	var Bindings = require("common/bindings");
	var DataBus = require("common/databus");
	var GameContext = require("common/gamecontext");
	var Audio = require("common/audio");

	var StacheMod = require("stache!html/game-score-mod");
	var StacheControl = require("stache!html/game-score-control");
	var StacheBeamer = require("stache!html/game-score-beamer");
	var StacheOverlay = require("stache!html/game-score-overlay");

	// --- PRIVATE VARS ---

	our.score = {
	};

	self.updateScore = function(action) {
		var gc = GameContext();

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


		require(["common/gamemanager"], function(GameManager){
			/*if(action[1] == "+" && gc.getType() != 'score')
				GameManager.tick();*/
			DataBus.send(path, scores);
		});


	};


	// --- PUBLIC VARS ---
	self.name = "Score"

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

	self.drawControl = function(gc) {
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
