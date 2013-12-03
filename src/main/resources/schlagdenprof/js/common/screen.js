define(function(require){
	
	var $ = require("jquery");
    var DataBus = require("common/databus");

	var our = {};
	our.$loading = $("#loading");
	our.$screensaver = $("#screensaver");


	self.add = function($el) {
		var $fs = $el;
		if(!$fs.is(".fullscreen")) {
			var $fs = $("<div>");
			$fs.addClass("fullscreen");
			$fs.html($el);

		}

		$fs.hide();
		$("body").append($fs);

		return $fs;

	};

	self.enable = function($el) {
		var $one = $el.filter(".fullscreen");
		var $all = $("body > .fullscreen");
		$all.not($one).filter(":visible").fadeOut();
		$one.fadeIn();

	};


	self.showLoading = function(){
		self.enable(our.$loading);

	};

	self.showScreensaver = function() {
		self.enable(our.$screensaver);

	};

	return self;

});
