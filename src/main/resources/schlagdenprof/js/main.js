require.config({
    baseUrl: 'bower_components/',
    paths: {
		pov : "../js/pov",
		html : "../html",
        utils : "../js/utils",
        games : "../js/games",

        jquery: 'jquery/jquery.min',
		bootstrap : "../bootstrap/js/bootstrap",
		text: 'requirejs-text/text',
		mustache: "mustache/mustache",
		stache: 'requirejs-mustache/stache',
		diff : 'diff/releases/deep-diff-0.1.4.min'
		
    },

	urlArgs : "bust=" + (new Date()).getTime(),

	shim : {
		bootstrap : {
			deps : [ 'jquery' ]
		},
		diff : {
			exports : "DeepDiff"
		},
		jquery : {
			exports : "jQuery"
		}
	}

});

requirejs(['pov/mod', 'pov/player', 'pov/beamer', "utils/databus",
	"bootstrap"],function(mod, player, beamer, DataBus) {
	
	var cssUrl;
	if(window.location.hash == "#mod")
		cssUrl = "bootstrap/css/bootstrap.slate.min.css";
	else
		cssUrl = "css/game.css";

	var $css = $("<link>");
	$css.attr("href", cssUrl);
	$css.attr("rel", "stylesheet");
	$("head").append($css);

	switch(window.location.hash) {
		case "#prof":
			player("prof");
			break;

		case "#stud":
			player("stud");
			break;

		case "#beamer":
			beamer();
			break;

		case "#mod":
			mod();
			break;

		default:
			alert("Unbekannter Blickwinkel!");
			break;
	}


	DataBus.start();

})
