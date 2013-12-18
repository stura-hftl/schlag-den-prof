define(function(require){
	var DataBus = require("common/databus");
	var Screen = require("common/screen");

	var modDom = require("stache!html/mod");
	var GamesTabStache = require("stache!html/mod.games");
    var GameManager = require("common/gamemanager");
    var GameContext = require("common/gamecontext");
	var ScoreGame = require("games/score");

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

		DataBus.register("beamer.show", function(data){
				$beamerButtons.attr("disabled", null);
				$beamerButtons.filter("[name='"+data.beamer.show+"']").attr("disabled", "disabled");
		});


		(function keyboardShortcuts(){
			$("body").keyup(function(e) {
				var gc = GameContext();

				switch(e.which){

					case 80: /*P*/
					case 81: /*Q*/
						if(e.shiftKey)
							ScoreGame.updateScore("p-");
						else
							ScoreGame.updateScore("p+");
						break;

					case 87: /*W*/
					case 79: /*O*/
						if(e.shiftKey)
							ScoreGame.updateScore("s-");
						else
							ScoreGame.updateScore("s+");
						break;

					case 186: /*Ö*/
					case 65: /*A*/
						DataBus.send("games."+gc.getRound()+".winner", "prof");
						break;

					case 76: /*L*/
					case 83: /*S*/
						DataBus.send("games."+gc.getRound()+".winner", "stud");
						break;

					case 96: /* NUM 0 */
						GameManager.tick();
						break;

					case 108: /* NUM , */
						GameManager.nextRound();
						break;

					case 50: /*2*/
						DataBus.send("beamer.show", "logo");
						break;
				
					case 51: /*3*/
						DataBus.send("beamer.show", "scores");
						break;
				
					case 52: /*4*/
						DataBus.send("beamer.show", "gameframe");
						break;
				
					default:
						console.log(e.which);
						break;
				};

				return false;

			});
		})();


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
			return false;
		});

		DataBus.register("names", function(data) {
			$startNameProf.val(data.names.prof);
			$startNameStud.val(data.names.stud);

		});

		/**
		 * GAME TAB
		 */

		var $gameTab = $modDom.find("#games");


		var updateGameTab = function(data) {
			var context = {};
			var games = data.games;
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

				var winner = $(this).attr("name");

				var data = {};
				data[num] = {};
				data[num].winner = winner;
				
				DataBus.send("games", data);

			});

			$html.find("[data-activate-game]").click(function(){
                var data = {};
				data.active = $(this).data("activate-game");
                data.beamer = {"show" : "gameframe"};
                data.step = null;



				if(!data.active) {
					data.active = null;
                    data.beamer.show = "logo";
                }

				DataBus.send("", data);

			});

			$gameTab.html($html);

            GameManager.drawStrokeControl(data);
			GameManager.drawOverlayControl(data);

		};

		DataBus.register("games", updateGameTab);
		DataBus.register("active", updateGameTab);
		DataBus.register("step", updateGameTab);

		/**
		 * FINISH
		 */

		var $modScreen = Screen.add($modDom);
		Screen.enable($modScreen);

	};
});
