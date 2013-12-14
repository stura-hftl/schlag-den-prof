define(function(require){

	var Tree = require("common/tree");
	var DataBus = require("common/databus");

	var pseudoClass = function(data, round, stroke){
		var self = {};
		var our = {};

		// --- PRIVATE VARS ---
		if(!data)
			data = DataBus.getData();

		our.data = Tree.deepcopy(data);
		our.round = round;   // number of game
		our.stroke = stroke; // number of position in the game (seq. pos.)

		if(typeof our.round !== 'string' || typeof our.round !== 'number')
			our.round = data.active;

		if(typeof our.stroke !== 'string' || typeof our.stroke !== 'number')
			our.stroke = data.step;



		// --- PUBLIC FUNCTIONS ---
		self.isSamePosition = function(gc2) {
			return (gc2.getRound() === self.getRound() &&
				self.getStroke() === gc2.getStroke())
		};

		self.getData = function() {
			return our.data;
		};

		self.getRound = function() {
			return our.round || 0;
		};

		self.getStroke = function() {
			return our.stroke || 0;
		};

		self.getGame = function() {
			return data.games[self.getRound()] || null;
		};

		self.getConfig = function() {
			if(self.getGame())
				return self.getGame().sequence[self.getStroke()-1] || [];
			else
				return [];
		};

		self.getType = function() {
			return self.getConfig().slice(0,1);
		};

		self.getArg = function(i) {
			return self.getArgs()[i];
		};

		self.getArgs = function() {
			return self.getConfig().slice(1);
		};

		self.getStatePath = function() {
			return "games." + self.getRound() + ".state." + 
				self.getStroke() + "_" + self.getType();
		};

		self.getState = function(path, def) {
			state = Tree.select(our.data, self.getStatePath());
			if(!path) return state;
			if(def && !state) return def;
			state = Tree.select(state, path);
			if(def && !state) return def;
			else return state;

		};

		self.sendState = function(state) {
			DataBus.send(self.getStatePath(), state);
		};

		return self;

	};

	return pseudoClass;

});
