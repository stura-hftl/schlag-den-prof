define(function(require){
	
	var $ = require("jquery");
    var DataBus = require("utils/databus");

	var $loading = $("#loading");
	var $screensaver = $("#screensaver");

	var Screen = {

		add : function($el) {
			var $fs = $el;
			if(!$fs.is(".fullscreen")) {
				var $fs = $("<div>");
				$fs.addClass("fullscreen");
				$fs.html($el);

			}

			$fs.hide();
			$("body").append($fs);

			return $fs;

		},

		enable : function($el) {
			var $one = $el.filter(".fullscreen");
			var $all = $("body > .fullscreen");
			$all.not($one).filter(":visible").fadeOut();
			$one.fadeIn();

		}



	}

	var self = {
		showLoading : function(){
			Screen.enable($loading);

		},

		showScreensaver : function() {
			Screen.enable($screensaver);

		},

		Screen : Screen
	};

    var _updateScore = function(games){
        var totalProf = 0;
        var totalStud = 0;

        $.each(games, function(num, game){
            var score = parseInt(num);

            if(game.winner == "prof")
                totalProf += score;

            if(game.winner == "stud")
                totalStud += score;

        });

        $("[data-bind=':score.total.prof']").text(totalProf);
        $("[data-bind=':score.total.stud']").text(totalStud);

    };

    var _updateCurrentGame = function(game) {
        if(!game)
            return;

        $("[data-bind=':activegame.name']").text(game.name);

    };

    DataBus.register("games", function(games, data) {
        _updateScore(games);
        _updateCurrentGame(games[data.active]);

    });

    DataBus.register("active", function(active, data) {
        var game = data.games[active];
        if(game) {
            _updateCurrentGame(game);

        }

    });

	return self;

});
