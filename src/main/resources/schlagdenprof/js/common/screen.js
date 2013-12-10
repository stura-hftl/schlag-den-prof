define(function(require){
	
	var $ = require("jquery");
    var DataBus = require("common/databus");

	var our = {};
	our.$loading = $("#loading");
	our.$screensaver = $("#screensaver");
	our.$all = $().
		add(our.$loading).
		add(our.$screensaver);


	self.add = function($el) {
		$el.hide();
		our.$all = our.$all.add($el);
		$("body").append($el);

		return $el;

	};

	self.enable = function($el) {
		our.$all.not($el).filter(":visible").fadeOut();
		$el.fadeIn();

	};


	self.showLoading = function(){
		self.enable(our.$loading);
	};

	self.showScreensaver = function() {
		self.enable(our.$screensaver);
	};

	return self;

});
