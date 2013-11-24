define(function(require){

    var GameFrameStache = require("stache!html/game.sequence.frame");
    var ModControlStache = require("stache!html/game.sequence.mod");

    var self = {};

    var defaults = {
        step: 0

    }


    self.redrawGameFrame = function(game, $container) {
        var state = jQuery.extend(defaults, game.state);

        var visible = game.config.sequence[state.step];
        var len = visible.length;

        $container.find(".image").each(function(i, el){
            var $el = $(el);
            var pos = visible.indexOf(""+$el.data("key"));

            if(pos < 0)
            {
                /*$el.filter(":visible").animate({
                 "width": "5%",
                 "left": "-5%"
                 });*/
                $el.filter(":visible").fadeOut();

            }

            else {
                var w = (100/len) ;
                var l = pos * w;

                var css = {
                    "width": w + "%",
                    "left": l + "%"
                }

                if($el.is(":visible"))
                    $el.animate(css);
                else
                    $el.css(css).fadeIn()

            }


        });

    }

    self.drawGameFrame = function(game) {

        var ctx = {};
        ctx.images = [];

        $.each(game.config.images, function(key, src){
            ctx.images.push({key: key, src:src});

        });

        var $html = $(GameFrameStache(ctx));

        return $html;

    }

    self.drawModControl = function(game, stateUpdate) {
        var state = jQuery.extend(defaults, game.state);

        var $html = $(ModControlStache(state));

        $html.filter("[data-action]").click(function(){
            switch($(this).data("action")) {
                case "next":
                    state.step++;
                    break;

                case "prev":
                    state.step--;
                    break;

            }

            stateUpdate(state);

        });

        return $html;

    }


    return self;

});