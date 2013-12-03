define(function(require){

    var DataBus = require("utils/databus");

    var ModSeqStache = require("stache!html/mod.seq");

    var Moves = {
        image: require("games/seq.image"),
        score : require("games/seq.score"),
        text : require("games/seq.text")
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

        if(!game) return;

        var step = data.step;

        if(!step) step = null;

        var $container = $("<div>");
        $container.data("active", active);

        $.each(game.sequence, function(i, config){
            var type = config.slice(0,1);
            var args = config.slice(1);
            var pos = i+1;

            var $el = Moves[type].drawBeamer(args, game.state, data);
			var $div = $("<div>");
			$div.html($el);
            $div.addClass("frame");
            $div.data("step", pos);
            if(i!=step) $div.hide();
            $container.append($div);

        });

        replace($("#game-content"), $container);


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
			meta.name = Moves[type].name;
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
			var config = game.sequence[pos-1];
			var type = config.slice(0,1);
			var args = config.slice(1);

			var $control = Moves[type].drawControl(data, pos);
			$el.html($control);

		});


        replace($("#mod-control"), $container);
        $("#mod-control").parents(".panel").show();

    };

    return self;


});
