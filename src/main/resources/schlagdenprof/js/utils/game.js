define(function(require){

    var DataBus = require("utils/databus");

    var Games = {
        simple_count : require("games/simple_count"),
        image_view : require("games/image_view")
    }


    var self = {};

    var currentGame = function(data) {
        return data.games[data.active];

    }

    self.drawGameFrame = function(data) {
        var game = currentGame(data);

        if(!game)
            return;

        var module = Games[game.type];
        $("#game-content").html(module.drawGameFrame(game));

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