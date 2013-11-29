define(function(require){
	
	var Common = require("utils/common");
	var DataBus = require("utils/databus");
    var Game = require("games/game");
	
	var $scores = $(require("stache!html/beamer.scores")());
    var $frame = $(require("stache!html/beamer.frame")());

	return function() {

        Common.Screen.add($scores);
        Common.Screen.add($frame);

        /**
         * BEAMER CONTROL
         */

        DataBus.register("beamer.show", function(show, data){
            switch(data.beamer.show){
                default:
                case "screensaver":
                    Common.showScreensaver();
                    break;

                case "logo":
                    Common.showLoading();
                    break;

                case "scores":
                    Common.Screen.enable($scores);
                    break;

                case "gameframe":
                    Common.Screen.enable($frame);
                    break;
            }
        });

        /**
         * GAME FRAME
         */
        DataBus.register("active", function(active, data){
            Game.drawGameFrame(data);

        });

        DataBus.register("step", function(active, data){
            Game.drawGameFrame(data);

        });

        DataBus.register("game", function(active, data){
            Game.drawGameFrame(data);

        });

    };


});
