define(function(require){

    var self = {};
	var our = {};

	var Tree = require("common/tree");
	var Bindings = require("common/bindings");
	var DataBus = require("common/databus");
	var StacheMod = require("stache!html/game-score-mod");
	var StacheBeamer = require("stache!html/game-score-beamer");

	// --- PRIVATE VARS ---

	our.score = {
		prof:0, stud:0
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

	});


	// --- PUBLIC FUNCTIONS ---

    self.drawBeamer = function(args, state, data){
		$el = $(StacheBeamer({number:data.active}));
		Bindings.rebind($el);

        return $el;

    };

	self.drawControl = function(data, step) {
		var $el = $("<div>").html(StacheMod());
		var winnerPath = "games."+data.active+".state.score."+step+".winner";

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

		if(data.step != step)
			$el.find("button").attr("disabled", "disabled");

		return $el;

	};




    return self;


});
