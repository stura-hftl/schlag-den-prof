define(function(require){

	var self = {};
	var our = {};

	// --- PRIVATE VARS ---

	our.enabled = false;
	our.files = {
		"score" : "audio/score.wav",
		"won-round" : "audio/won-round.wav",
	};
	our.$els = {};

	// --- PRIVAT FUNCTIONS ---
	var createAudio = function(key){
		var path = our.files[key];
		$el = $("<audio>");
		$el.attr("src", path);
		$("body").append($el);

		$el[0].addEventListener("ended", function(){
			$el.remove();
		}, false);

		return $el;

	};


	// --- PUBLIC FUNCTIONS ---
	
	self.play = function(key){
		if(our.enabled) {
			var $el = createAudio(key);
			var el = $el[0];
			el.play();
		}

	};

	self.enable = function(){
		our.enabled = true;

	};


	return self;

});
