/**
 * Evaluator
 *
 * Eliminate dynamic constructs (e.g., variable, @if, @for).
 */
'use strict';

var Visitor = require('../visitor');
var bif = require('../bif');
var Scope = require('./scope');
module.exports = Evaluator;

function Evaluator() {}

Evaluator.prototype = new Visitor();

Evaluator.prototype.evaluate = function(ast) {
	this.scope = new Scope(bif);
	return this.visit(ast);
};

require('./node/ruleset');
require('./node/selector');
require('./node/selectorInterpolation');
require('./node/classSelector');
require('./node/assignment');
require('./node/call');
require('./node/function');
require('./node/return');
require('./node/variable');
require('./node/identifier');
require('./node/string');
require('./node/range');
require('./node/logical');
require('./node/equality');
require('./node/relational');
require('./node/arithmetic');
require('./node/unary');
require('./node/media');
require('./node/mediaQuery');
require('./node/mediaInterpolation');
require('./node/void');
require('./node/block');
require('./node/if');
require('./node/for');
require('./node/keyframes');
require('./node/keyframe');
require('./node/module');
require('./node/fontFace');