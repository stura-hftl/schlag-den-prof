define(function(require){

    var GameFrameStache = require("stache!html/game.simple_count.frame");
    var ModControlStache = require("stache!html/game.simple_count.mod");

    var self = {};

    var defaults = {
        countProf : 0,
        countStud : 0
    }

    self.drawGameFrame = function(game) {
        var state = jQuery.extend(defaults, game.state);

        return GameFrameStache(state);

    }

    self.drawModControl = function(game, stateUpdate) {
        var state = jQuery.extend(defaults, game.state);


        $html = $(ModControlStache(state));

        $html.find("[data-action]").click(function(){
            var $el = $(this);
            var action = $el.data("action");

            switch(action){
                case "prof-":
                    state.countProf--;
                    break;
                case "prof+":
                    state.countProf++;
                    break;
                case "stud-":
                    state.countStud--;
                    break;
                case "stud+":
                    state.countStud++;
                    break;
            }

            stateUpdate(state);

        });

        return $html;

    }


    return self;

});