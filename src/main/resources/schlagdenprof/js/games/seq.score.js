define(function(require){

    var self = {};
	var our = {};

	var Common = require("utils/common");
	var StacheControl = require("stache!html/game.score.control");

	// --- PRIVATE VARS ---

	our.defaultState = {
		score : { prof:0, stud:0 }
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


	// --- PUBLIC FUNCTIONS ---

    self.draw = function(args, state, data){
		var $el = getTemplate();
		var $tds = $el.find("td");
		
		$($tds[0]).attr("data-bind", "names.prof");
		$($tds[1]).attr("data-bind", "names.stud");
		$($tds[2]).attr("data-bind", "games."+data.active+".state.score.prof");
		$($tds[3]).attr("data-bind", "games."+data.active+".state.score.stud");

		Common.rebind($el);

        return $el;

    };

	self.drawControl = function(args, state, data) {
		var $el = $("<div>").html(StacheControl());

		$el.find("[name]").click(function(){

		});

		return $el;

	};




    return self;


});
