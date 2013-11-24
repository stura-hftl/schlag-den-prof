define(function(require){

    var DataBus = require("utils/databus");

    var Games = {
        simple_count : require("games/simple_count"),
        image_slide : require("games/image_slide")
    }


    var self = {};

    var currentGame = function(data) {
        return data.games[data.active];

    }

    self.drawGameFrame = function(data) {
        var game = currentGame(data);
        var active = data.active;

        if(!game)
            return;

        var module = Games[game.type];
        var draw = module.drawGameFrame;
        var redraw = module.redrawGameFrame;

        var $container = $("#game-content");
        var $el;

        if($container.data("active-game") == active && redraw) {
            redraw(game, $container);

        } else {
            $container.html(draw(game));
            redraw(game, $container);
            $container.data("active-game", active);

        }

    };

    self.drawModControl = function(data) {
        var game = currentGame(data);

        if(!game)
            return;

        var stateUpdate = function(newState) {
            var path = "games." + data.active + ".state";
            DataBus.send(path, newState);

        };

        var module = Games[game.type];
        $("#mod-control").html(module.drawModControl(game, stateUpdate));

    };


    return self;


});