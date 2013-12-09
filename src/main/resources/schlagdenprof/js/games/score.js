define(function(require){

    var self = {};
	var our = {};

	var Tree = require("common/tree");
	var Bindings = require("common/bindings");
	var DataBus = require("common/databus");
	var StacheMod = require("stache!html/game-score-mod");
	var StacheBeamer = require("stache!html/game-score-beamer");
	var Audio = require("common/audio");

	// --- PRIVATE VARS ---

	our.score = {
	};


	// --- PUBLIC VARS ---
	self.name = "Score"


	// --- STATIC BLOCK ---

	DataBus.register(/^(games.(.+).state.score)/, function(data, match){
		var path = match[1];
		var score = Tree.select(data, path);

		var stud = 0;
		var prof = 0;

		if(score) $.each(score, function(i, v){
			if(v.winner == "stud")
				stud++;

			if(v.winner == "prof")
				prof++;

		});

		Bindings.set(path+":total.stud", stud.toString());
		Bindings.set(path+":total.prof", prof.toString());

		if(	(typeof our.score.prof !== 'undefined') &&
			(typeof our.score.stud !== 'undefined') &&
			((our.score.prof < prof) || (our.score.stud < stud))
		)
			Audio.play("score");

		our.score.prof = prof;
		our.score.stud = stud;

	});


	// --- PUBLIC FUNCTIONS ---

    self.drawBeamer = function(gc){
		$el = $(StacheBeamer({ number : gc.getRound() }));
		Bindings.rebind($el);

        return $el;

    };

	self.drawControl = function(gc) {
		var $el = $("<div>").html(StacheMod());
		var winnerPath = "games."+gc.getData().active+".state.score."+gc.getStroke()+".winner";

		$el.find("[name]").click(function(){
			var name = $(this).attr("name");
			if(name == "none") name = null;
			DataBus.send(winnerPath, name);

		});

		var winner = DataBus.getDataByPath(winnerPath);

		$el.find("[name]").each(function(i, btn){
			var $btn = $(btn);
			var name = $btn.attr("name");
			if(winner == name)
				$btn.addClass("btn-success");	

			if(name == "none" && !winner)
				$btn.addClass("btn-danger");

		});

		return $el;

	};




    return self;


});
