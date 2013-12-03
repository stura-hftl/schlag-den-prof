define(function(require){

	var self = {};
	var our = {};

	// from: http://stackoverflow.com/questions/722668/
	self.traverse = function(o, prefix, func) {
		func.apply(this, [o, prefix]);  
		if (o !== null && typeof(o)=="object") {
			for (var i in o) {
				if(!prefix)
					var path = i;
				else
					var path = prefix + "." + i;

				self.traverse(o[i], path, func);

			}

		}

	};

	self.select = function(o, path){
        var keys = path.split(".");
        while(keys.length > 0)
        {
            var key = keys.shift();
            if(!(key in o))
                return null;
            o = o[key];
        }

        return o;

	};

	self.deepcopy = function(o) {
		return jQuery.extend(true, {}, o);

	};

	return self;

});
