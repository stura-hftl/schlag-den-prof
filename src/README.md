


JS code infos
=============

AMD package style
-----------------

 * There are always two package objects: `self` and `our`
 * `self` contains all public vars and functions and will be returned at the end
   of package.
 * `our` contains *all* private vars.
 * Packages vars, other than `self` and `our`, must be private functions or
   other packages.
 * Other packages must start with a uppercase letter.
 * Functions must start with a lowercase letter.


Package template
----------------

		define(function(require){
			var self = {};
			var our = {};

			// --- IMPORTS ---
			// eg: var jQuery = require("jQuery");

			// --- PRIVATE VARIABLES ---
			// eg: our.URI = "ws://hell:8080/";

			// --- PRIVATE FUNCTIONS ---
			// eg: var doFoo = function(){};

			// --- PUBLIC FUNCTIONS ---
			// eg: self.getBar = function(){};

			return self;

		});


