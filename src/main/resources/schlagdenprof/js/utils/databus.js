define(function(require){
	// --- IMPORTS ---
	var DeepDiff = require("diff");
	var jQuery = require("jquery");

	// --- PRIVATE VARS ---
	var self = {};
	var our = {};

	our.URI = "ws://"+window.location.hostname+":8025/schlagdenprof/databus";
	our.data = {};
	our.registry = {};
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
		var keys = path.split(".");
		while(keys.length > 0)
		{
			var key = keys.shift();
			data = data[key];
		}

		return data;

	};


	// --- WEBSOCKET CONNECTION ---
	our.ws.onmessage = function(e) {
		if(!isActive())
			return;

		var message = JSON.parse(e.data);
		var diffs = DeepDiff(our.data, message);
		our.data = message;

		console.log(">>>", e.data);

		if(!diffs)
			return;

		var matchingPaths = [];
		
		while(diffs.length > 0)
		{
			var diff = diffs.shift();
			var keys = diff.path;

			if(!keys)
				continue;

			var mpath = keys.join(".");
			var ml = mpath.length;

			var __check = function(fpath) {
				var fl = fpath.length;
				var len = (fl<ml)?fl:ml;

				if(mpath.slice(0,len) == fpath.slice(0,len))
					matchingPaths.push(fpath);

			};

			Object.keys(our.registry).forEach(__check);

			$("[data-bind]").each(function(i, el){
				var $el = $(el);
				var fpath = $el.data("bind");
				__check(fpath);

			});

			
		}

		while(matchingPaths.length > 0)
		{
			var path = matchingPaths.shift();

			var $el = $("[data-bind='"+path+"']");

			if($el) {
				console.log("+++", path);
				var value = getNode(path, our.data);
				$el.text(value);
			}



			if(our.registry[path]) {
				console.log("***", path);
				var node = getNode(path, our.data);
				for (var i = 0; i < our.registry[path].length; i++)
					our.registry[path][i](node, our.data);
			}

		}


					

	};
		
	our.ws.onopen = function () {
		activate("open");
	};

	our.ws.onerror = function() {
		console.log('WebSocket Error ' + error);
        var Common = require("utils/common");
		Common.showScreensaver();

	};

	our.ws.onclose = function() {
		console.log("WebSocket connection closed.");
        var Common = require("utils/common");
		Common.showScreensaver();

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
		console.log("<<<", buffer);
		our.ws.send(buffer);

	};

	self.register = function(path, fn) {
		if(!our.registry[path])
			our.registry[path] = [];

		our.registry[path].push(fn);

	};

	self.getData = function() {
		return jQuery.extend(true, {}, our.data); // deep copy

	};



	return self;

});


