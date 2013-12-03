define(function(require){

    var self = {};
	var our = {};

	var Common = require("utils/common");
	var Tools = require("utils/tools");
	var DataBus = require("utils/databus");
	var StacheControl = require("stache!html/game.score.control");

	// --- PRIVATE VARS ---

	our.score = {
		prof:0, stud:0
	};


	// --- PUBLIC VARS ---
	self.name = "Score"


	// --- PRIVATE FUNCTIONS ---

	var getTemplate = function(){
		var $tr1 = $("<tr>");
		$tr1.append("<td>");
		$tr1.append("<td>");

		var $tr2 = $tr1.clone();

		$tr1.find("td").addClass("bigscore-name");
		$tr2.find("td").addClass("bigscore-total");

        var $table = $("<table>");
		$table.addClass("bigscore");
		$table.append($tr1);
		$table.append($tr2);

		return $table;

	};


	// --- STATIC BLOCK ---

	DataBus.register(/^(games.(.+).state.score)/, function(data, match){
		var path = match[1];
		var score = Tools.Tree.select(data, path);

		var stud = 0;
		var prof = 0;

		if(score) $.each(score, function(i, v){
			if(v.winner == "stud")
				stud++;

			if(v.winner == "prof")
				prof++;

		});

		Common.Binding.set(path+":total.stud", stud.toString());
		Common.Binding.set(path+":total.prof", prof.toString());

	});



	// --- PUBLIC FUNCTIONS ---

    self.drawBeamer = function(args, state, data){
		var $el = getTemplate();
		var $tds = $el.find("td");
		
		$($tds[0]).attr("data-bind", "names.prof");
		$($tds[1]).attr("data-bind", "names.stud");
		$($tds[2]).attr("data-bind", "games."+data.active+".state.score:total.stud");
		$($tds[3]).attr("data-bind", "games."+data.active+".state.score:total.prof");
		Common.rebind($el);

        return $el;

    };

	self.drawControl = function(data, step) {
		var $el = $("<div>").html(StacheControl());
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
