'use strict';

var RooleError = require('../../error');
var Extender = require('../');

Extender.prototype.visitSelector = function(selectorNode) {
	this.visit(selectorNode.children);

	if (this.hasAmpersandSelector) {
		this.hasAmpersandSelector = false;
		return;
	}

	var firstNode = selectorNode.children[0];
	var startWithCombinator = firstNode.type === 'combinator';
	if (startWithCombinator) {
		if (!this.parentSelector) {
			throw RooleError("selector starting with a combinator is not allowed at the top level", firstNode);
		}

		selectorNode.children = this.parentSelector.children.concat(selectorNode.children);
	} else if (this.parentSelector) {
		var combinator = {
			type: 'combinator',
			children: [' '],
			loc: selectorNode.loc,
		};
		selectorNode.children = this.parentSelector.children.concat(combinator, selectorNode.children);
	}
};