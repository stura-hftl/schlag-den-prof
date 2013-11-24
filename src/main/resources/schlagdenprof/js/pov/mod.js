define(function(require){
	var Common = require("utils/common");
	var DataBus = require("utils/databus");

	var modDom = require("stache!html/mod");
	var GamesTabStache = require("stache!html/mod.games");
    var Game = require("utils/game");

	return function() {
		var $modDom = $(modDom());

		$("body").attr("style", null);

		/**
		 * BEAMER CONTROL
		 */
		var $beamerBtnGroup = $modDom.find("#beamer-btn-group");
		var $beamerButtons = $beamerBtnGroup.find("button");

		$beamerButtons.click(function(){
			DataBus.send("beamer.show", $(this).attr("name"));
			return false;
		});

		DataBus.register("beamer.show", function(show, data){
				$beamerButtons.attr("disabled", null);
				$beamerButtons.filter("[name='"+data.beamer.show+"']").attr("disabled", "disabled");
		});


		/**
		 * START
		 */

		var $startNameStud = $modDom.find("#start-name-stud");
		var $startNameProf = $modDom.find("#start-name-prof");
		var $startNameSubmit = $modDom.find("#start-name-submit");

		$startNameSubmit.click(function(){
			DataBus.send("names", {
				"prof": $startNameProf.val(),
				"stud": $startNameStud.val()
			});
		});

		DataBus.register("names", function(names, data) {
			$startNameProf.val(data.names.prof);
			$startNameStud.val(data.names.stud);

		});

		/**
		 * GAME TAB
		 */

		var $gameTab = $modDom.find("#games");


		var updateGameTab = function(games, data) {
			var context = {};
			context.games = [];
			
			if(!data.active)
				context.idle = true;

			$.each(games, function(num, game){
				var gameContext = {
					name : game.name,
					num : num,
					type : game.type
				};


				if(game.winner=='prof')
					gameContext.winProf = true;
				else if(game.winner=='stud')
					gameContext.winStud = true;
				else
					gameContext.winNone = true;

				if(num == data.active)
					gameContext.active = true;



				context.games.push(gameContext);

			});


			var html = GamesTabStache(context);
			var $html = $(html);

			$html.find("[data-game] button").click(function(){
				var $grp = $(this).parents("[data-game]");
				var num = $grp.data("game");

				var party = $(this).attr("name");

				var data = {};
				data[num] = {};
				data[num].winner = party;
				
				DataBus.send("games", data);

			});

			$html.find("[data-activate-game]").click(function(){
                var data = {};
				data.active = $(this).data("activate-game");
                data.beamer = {"show" : "gameframe"};



				if(!data.active) {
					data.active = null;
                    data.beamer.show = "logo";
                }

				DataBus.send("", data);

			});

			$gameTab.html($html);

            Game.drawModControl(data);
		};

		DataBus.register("games", updateGameTab);
		DataBus.register("active", function(active,data){
			updateGameTab(data.games, data);
		});

		/**
		 * FINISH
		 */

		var $modScreen = Common.Screen.add($modDom);
		Common.Screen.enable($modScreen);

	};
});
