/**
 * Roole
 *
 * Expose public APIs.
 */
'use strict';

var _ = require('./helper');
var Parser = require('./parser');
var Importer = require('./importer');
var Evaluator = require('./evaluator');
var Extender = require('./extender');
var Normalizer = require('./normalizer');
var Prefixer = require('./prefixer');
var Compiler = require('./compiler');
var formatter = require('./formatter');
var roole = exports;

roole.version = require('../package.json').version;

roole.defaults = {
	prefix: 'webkit moz ms o',
	indent: '\t',
	precision: 3,
	skipPrefixed: false,
	prettyError: false,
	filename: '',
	imports: {}
};

roole.compile = function(input, options, callback) {
	if (callback == null) {
		callback = options;
		options = {};
	} else if (options == null) {
		options = {};
	}

	options = _.mixin({}, roole.defaults, options);
	options.imports[options.filename] = input;
	if (options.prettyError) {
		var cb = callback;
		callback = function (error, output) {
			if (error && error.loc) {
				var input = options.imports[error.loc.filename];
				error.message = formatter.format(error, input);
			}
			cb(error, output);
		};
	}

	compile(input, options, callback);
};

function compile(input, options, callback) {
	var output;
	try {
		output = new Parser(options).parse(input);
	} catch (error) {
		return callback(error);
	}
	new Importer(options).import(output, function(error, output) {
		if (error) {
			return callback(error);
		}
		try {
			output = new Evaluator(options).evaluate(output);
			output = new Extender(options).extend(output);
			output = new Normalizer(options).normalize(output);
			output = new Prefixer(options).prefix(output);
			output = new Compiler(options).compile(output);
		} catch (error) {
			return callback(error);
		}
		callback(null, output);
	});
}