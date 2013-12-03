define(function(require){
	// --- IMPORTS ---
	var DeepDiff = require("diff");
	var jQuery = require("jquery");
	var Tree = require("common/tree");

	// --- PRIVATE VARS ---
	var self = {};
	var our = {};

	our.URI = "ws://"+window.location.hostname+":8025/schlagdenprof/databus";
	our.data = {};
	our.registry = [];
	our.ws = new WebSocket(our.URI, "schlagdenprof");

	our.startLock = {
		main : false,
		open : false
	};

	// --- PRIVATE FUNCTIONS ---
	var isActive = function() {
		return (our.startLock.main == true && our.startLock.open == true);
	};

	var activate = function(name){
		our.startLock[name] = true;

		if(isActive())
		{
			our.data = {};
			self.send("", {});
		}
	};

	var getNode = function(path, data) {
		return Tree.select(data, path);

	};


	// --- WEBSOCKET CONNECTION ---
	our.ws.onmessage = function(e) {
		if(!isActive())
			return;

		var message = JSON.parse(e.data);
		var diffs = DeepDiff(our.data, message);
		our.data = message;

		console.log(">>>", message);

		if(!diffs)
			return;

		var paths = [];

		$.each(our.registry, function(i, tuple){
			paths.push(tuple);

		});

		$("[data-bind]").each(function(i, el){
			var $el = $(el);
            var path = $el.data("bind");
			var pattern = new RegExp("^"+path+"$");

			paths.push([pattern, function(data){
				$el.text(Tree.select(data, path));

			}]);

		});

		while(diffs.length > 0)
		{
			var diff = diffs.shift();
			var keys = diff.path;

			if(!keys)
				continue;

			var diff_path = keys.join(".");
			var diff_data = Tree.select(message, diff_path);

			Tree.traverse(diff_data, diff_path, function(sub_data, sub_path){
				// grep, to remove always called functions
				paths = $.grep(paths, function(tuple, i){
					var pattern = tuple[0];
					var fn = tuple[1];
					var match = sub_path.match(pattern);

					if(match){
						console.log(":::", pattern, match);
						fn(our.data, match);
						return false;

					};

					return true;

				});

			});

		};

	};
		
	our.ws.onopen = function () {
		activate("open");
	};

	our.ws.onerror = function() {
		console.log('WebSocket Error ' + error);
		require(["common/screen"], function(Screen){
			Screen.showScreensaver();
		});

	};

	our.ws.onclose = function() {
		console.log("WebSocket connection closed.");
		require(["common/screen"], function(Screen){
			Screen.showScreensaver();
		});

	};

	// --- PUBLIC FUNCTIONS
	self.start = function() {
		activate("main");

	};

	self.send = function(prefix, data){
		var keys = prefix.split(".");

        if(!keys || !prefix )
            keys = [];

		while(keys.length > 0)
		{
			var key = keys.pop();
			var tmp = {};
			tmp[key] = data;
			data = tmp;
		}

		var buffer = JSON.stringify(data);
		console.log("<<<", data);
		our.ws.send(buffer);

	};

	self.register = function(pattern, fn) {
		console.log("+++", pattern);

		if(!(pattern instanceof RegExp))
			pattern = new RegExp("^"+pattern);

		our.registry.push([pattern, fn]);

	};

	self.getData = function() {
		return jQuery.extend(true, {}, our.data); // deep copy

	};

	self.getDataByPath = function(path) {
		return getNode(path, our.data);

	};



	return self;

});


