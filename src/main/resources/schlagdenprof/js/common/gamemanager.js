define(function(require){

    var DataBus = require("common/databus");
	var GameContext = require("common/gamecontext");

    var ModSeqStache = require("stache!html/mod.seq");

    var Games = {
        score : require("games/score"),
		image : require("games/image"),
		mappick : require("games/mappick"),
		text : require("games/text"),
		countdown : require("games/countdown"),
    }

    var self = {};

    var replace = function($root, $el, fnIn, fnOut) {
        $root.children().not($el).filter(":visible").remove();

        $root.append($el);
        $el.show();

    }

    self.drawGameFrame = function(data) {
        var active = data.active;
        var game = data.games[data.active];
		var step = data.step;

        if(!game || !step) {
			$("#game-content").html("");

		} else {
			var gc = GameContext(data, data.active, step);
			var $el = Games[gc.getType()].drawBeamer(gc);
			$("#game-content").html($el);

		}

    };

    self.drawModControl = function(data) {
        var active = data.active;
        var game = data.games[active];
        var step = data.step;

        if(!game) {
            $("#mod-control").parents(".panel").hide();
            return;
        }

        var ctx = {
            items : [],
            idle : !Boolean(step)
        };




        $.each(game.sequence, function(i, config){
            var type = config.slice(0,1);
            var args = config.slice(1);
            var pos = i+1;

			var meta = {};
			meta.name = Games[type].name;
            meta.pos = pos;

            if(step === pos)
                meta.active = true;

            ctx.items.push(meta);

        });

        var $container = $(ModSeqStache(ctx));

        $container.find("[data-action]").click(function(){
            var action = $(this).data("action");
            var pos = $(this).data("pos");

            if(action == "stop" || action == "jump")
            {
                if(action == "stop")
                    pos = null;

                DataBus.send("step", pos);

            }
        });
		
		$container.find("[data-content]").each(function(i,el){
			var $el = $(el);

			if($el.data("content") != "control-panel")
				return;

			var pos = $el.data("pos");
			var gc = GameContext(data, null, pos);

			var $control = Games[gc.getType()].drawControl(gc);
			$el.html($control);

		});


        replace($("#mod-control"), $container);
        $("#mod-control").parents(".panel").show();

    };

    return self;


});
