define(function(require){

	var self = {};
	var our = {}

	// --- IMPORTS ---
	var $ = require("jquery");
    var DataBus = require("common/databus");


	// --- PRIVATE VARS ---
	our.bindings = {};


	// --- PUBLIC FUNCTIONS ---
	self.rebind = function($container) {
		$.each($container.find("[data-bind]"), function(i,el) {
			var $el = $(el);
			var key = $el.data("bind");
			var busValue = DataBus.getDataByPath(key);
			if(busValue)
				$el.text(busValue);

			var setValue = our.bindings[key];
			if(setValue)
				$el.text(setValue);

		});
	};

	self.set = function(key, value) {
		our.bindings[key] = value;
		var $el = $("[data-bind='"+key+"']");
		$el.text(value);

	};

	return self;

});
