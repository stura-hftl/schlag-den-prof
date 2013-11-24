define(function(require){
	var DeepDiff = require("diff");


	var URI = "ws://"+window.location.hostname+":8025/schlagdenprof/databus";


	var storedBusData = {};
	var registry = {};

	var connection = new WebSocket(URI, "schlagdenprof");

	var activeConditions = {
		main : false,
		open : false
	};

	var isActive = function() {
		return (activeConditions.main == true && activeConditions.open == true);
	};

	var activate = function(name){
		activeConditions[name] = true;

		if(isActive())
		{
			storedBusData = {};
			send("", {});
		}
	};

	var send = function(prefix, data){
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
		connection.send(buffer);

	};

	var register = function(path, fn) {
		if(!registry[path])
			registry[path] = [];

		registry[path].push(fn);

	};

	var _getNode = function(path, data) {
		var keys = path.split(".");
		while(keys.length > 0)
		{
			var key = keys.shift();
			data = data[key];
		}

		return data;

	};

	connection.onmessage = function(e) {
		if(!isActive())
			return;

		var message = JSON.parse(e.data);
		var diffs = DeepDiff(storedBusData, message);
		storedBusData = message;

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

			Object.keys(registry).forEach(__check);

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
				var value = _getNode(path, storedBusData);
				$el.text(value);
			}



			if(registry[path]) {
				console.log("***", path);
				var node = _getNode(path, storedBusData);
				for (var i = 0; i < registry[path].length; i++)
					registry[path][i](node, storedBusData);
			}

		}


					

	};
		
	connection.onopen = function () {
		activate("open");
	};

	connection.onerror = function() {
		console.log('WebSocket Error ' + error);
        var Common = require("utils/common");
		Common.showScreensaver();

	};

	connection.onclose = function() {
		console.log("WebSocket connection closed.");
        var Common = require("utils/common");
		Common.showScreensaver();

	};


	return {
		send : send,
		register : register,
		start : function(){
			activate("main");
		}

	};

});


