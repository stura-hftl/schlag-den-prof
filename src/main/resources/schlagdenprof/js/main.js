require.config({
    baseUrl: 'bower_components/',
    paths: {
		pov : "../js/pov",
		html : "../html",
        utils : "../js/utils",
        common : "../js/common",
        games : "../js/games",
        boot : "../js/boot",

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

requirejs(['boot'], function(boot) {
	

})
