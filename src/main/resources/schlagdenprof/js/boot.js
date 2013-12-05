define(function(require){

	var our = {};

	var Bootstrap = require("bootstrap"); // included for event hooking
	var DataBus = require("common/databus");
	var Bindings = require("common/bindings");
	
	var PovMod = require("pov/mod");
	var PovBeamer = require("pov/beamer");
	var PovPlayer = require("pov/player");


	// --- STATIC BLOCK ---
	switch(window.location.hash) {
		case "#prof":
			PovPlayer("prof");
			break;

		case "#stud":
			PovPlayer("stud");
			break;

		case "#beamer":
			PovBeamer();
			break;

		case "#mod":
			PovMod();
			break;

		default:
			alert("Unbekannter Blickwinkel!");
			break;
	}

	(function loadCss() {
		var url;
		if(window.location.hash == "#mod")
			url = "bootstrap/css/bootstrap.slate.min.css";
		else
			url = "css/game.css";

		var $css = $("<link>");
		$css.attr("href", url);
		$css.attr("rel", "stylesheet");
		$("head").append($css);

	})();

	DataBus.register(/^games.\d+.winner/, function(data){

        var totalProf = 0;
        var totalStud = 0;

        $.each(data.games, function(num, game){
            var score = parseInt(num);

            if(game.winner == "prof")
                totalProf += score;

            if(game.winner == "stud")
                totalStud += score;

        });

		Bindings.set(":score.total.prof", totalProf.toString());
		Bindings.set(":score.total.stud", totalStud.toString());

    });

	DataBus.register(/^active/, function(data, match) {
		var game = data.games[data.active];
		Bindings.set(":activegame.name", game.name);

	});

	(function setZoom(){
		var getURLParameter = function (name) {
			return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
		}

		var zoom = getURLParameter("zoom");
		if(zoom)
			$("body").css("zoom", zoom);

	})();


	DataBus.start();
});
