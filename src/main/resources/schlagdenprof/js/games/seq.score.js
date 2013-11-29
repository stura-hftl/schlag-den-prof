define(function(require){

    var self = {};
	var our = {};

	var Common = require("utils/common");

	our.defaultState = {
		score : { prof:0, stud:0 }
	};


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


    self.draw = function(args, state, data){
		var $el = getTemplate();
		var $tds = $el.find("td");
		
		$($tds[0]).attr("data-bind", "names.prof");
		$($tds[1]).attr("data-bind", "names.stud");
		$($tds[2]).attr("data-bind", "games."+data.active+".state.score.prof");
		$($tds[3]).attr("data-bind", "games."+data.active+".state.score.stud");

		Common.rebind($el);

        return $el;

    }


    self.getModMeta = function(args){
		var $state = $("<div>");

		$state.add("<button>");
		$state.add("<button>");


        return {
            "name": "Score",
			"hasWinner" : true
        }

    };


    return self;


});
