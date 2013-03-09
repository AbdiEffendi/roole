/**
 * Compiler
 *
 * Compile ast to css.
 */
'use strict';

var defaults = require('../defaults');
var Visitor = require('../visitor');
var Compiler = module.exports = function() {};

Compiler.prototype = new Visitor();

Compiler.prototype.compile = function(ast, options) {
	if (options == null) options = {};
	if (options.indent == null) options.indent = defaults.indent;
	if (options.precision == null) options.precision = defaults.precision;

	this.indentUnit = options.indent;
	this.precision = options.precision;
	this.indentLevel = 0;

	return this.visit(ast);
};

Compiler.prototype.indent = function() {
	++this.indentLevel;
};

Compiler.prototype.outdent = function() {
	--this.indentLevel;
};

Compiler.prototype.indentString = function() {
	return new Array(this.indentLevel + 1).join(this.indentUnit);
};

require('./node/node');
require('./node/root');
require('./node/comment');
require('./node/ruleset');
require('./node/selectorList');
require('./node/combinator');
require('./node/universalSelector');
require('./node/classSelector');
require('./node/hashSelector');
require('./node/attributeSelector');
require('./node/negationSelector');
require('./node/pseudoSelector');
require('./node/propertyList');
require('./node/property');
require('./node/rulesetList');
require('./node/ruleList');
require('./node/media');
require('./node/mediaQueryList');
require('./node/mediaQuery');
require('./node/mediaType');
require('./node/mediaFeature');
require('./node/import');
require('./node/url');
require('./node/string');
require('./node/number');
require('./node/percentage');
require('./node/dimension');
require('./node/color');
require('./node/function');
require('./node/argumentList');
require('./node/range');
require('./node/null');
require('./node/separator');
require('./node/keyframes');
require('./node/keyframeList');
require('./node/keyframe');
require('./node/keyframeSelectorList');
require('./node/fontFace');
require('./node/charset');