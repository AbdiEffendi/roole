'use strict';

var Evaluator = require('../evaluator');

Evaluator.prototype.visitSelector = function(selectorNode) {
	var childNodes = [];

	selectorNode.children.forEach(function(childNode) {
		childNode = this.visit(childNode);

		// make sure not to result in two consecutive combinators
		//
		//   $selector = '> div';
		//   body $selector {}
		//
		// would result in space combinator followed by > combinator
		if (Array.isArray(childNode)) {
			if (
				childNode[0].type === 'combinator' &&
				childNodes.length &&
				childNodes[childNodes.length - 1].type === 'combinator'
			) {
				childNodes.pop();
			}

			childNodes = childNodes.concat(childNode);
		} else {
			childNodes.push(childNode);
		}
	}, this);

	selectorNode.children = childNodes;
};