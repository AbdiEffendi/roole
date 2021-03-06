'use strict';

var Node = require('../../node');
var Evaluator = require('../');

Evaluator.prototype.visitRelational = function(relationalNode) {
	var operator = relationalNode.operator;
	var leftNode = this.visit(relationalNode.children[0]);
	var rightNode = this.visit(relationalNode.children[1]);

	var trueNode = function() {
		return {
			type: 'boolean',
			children: [true],
			loc: leftNode.loc,
		};
	};
	var falseNode = function() {
		return {
			type: 'boolean',
			children: [false],
			loc: leftNode.loc,
		};
	};

	var leftValue, rightValue;
	if (
		leftNode.type === 'identifier' && rightNode.type === 'identifier' ||
		leftNode.type === 'string' && rightNode.type === 'string'
	) {
		leftValue = leftNode.children[0];
		rightValue = rightNode.children[0];
	} else {
		leftValue = Node.toNumber(leftNode);
		if (leftValue === null) {
			return falseNode();
		}

		rightValue = Node.toNumber(rightNode);
		if (rightValue === null) {
			return falseNode();
		}
	}

	switch (operator) {
	case '>':
		return leftValue > rightValue ? trueNode() : falseNode();
	case '>=':
		return leftValue >= rightValue ? trueNode() : falseNode();
	case '<':
		return leftValue < rightValue ? trueNode() : falseNode();
	case '<=':
		return leftValue <= rightValue ? trueNode() : falseNode();
	}
};