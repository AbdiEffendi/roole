'use strict';

var RooleError = require('../../error');
var Node = require('../../node');
var Evaluator = require('../');

Evaluator.prototype.visitFor = function(forNode) {
	var stepNode = this.visit(forNode.children[2]);
	var stepNumber = 1;
	if (stepNode) {
		stepNumber = Node.toNumber(stepNode);
		if (stepNumber === null) {
			throw RooleError("step number must be a numberic value", stepNode);
		}

		if (!stepNumber) {
			throw RooleError("step number is not allowed to be zero", stepNode);
		}
	}

	var valueVariableNode = forNode.children[0];
	var indexVariableNode = forNode.children[1];
	var listNode = this.visit(forNode.children[3]);
	listNode = Node.toListNode(listNode);
	var ruleListNode = forNode.children[4];

	var valueVariableName = valueVariableNode.children[0];

	if (listNode.type === 'null') {
		this.scope.define(valueVariableName, listNode);

		if (indexVariableNode) {
			var indexVariableName = indexVariableNode.children[0];
			var indexNode = {
				type: 'null',
				loc: indexVariableNode.loc,
			};
			this.scope.define(indexVariableName, indexNode);
		}

		return null;
	}

	if (listNode.type !== 'list') {
		this.scope.define(valueVariableName, listNode);

		if (indexVariableNode) {
			var indexVariableName = indexVariableNode.children[0];
			var indexNode = {
				type: 'number',
				children: [0],
				loc: indexVariableNode.loc,
			};
			this.scope.define(indexVariableName, indexNode);
		}

		return this.visit(ruleListNode.children);
	}

	var itemNodes = listNode.children;
	var lastIndex = (itemNodes.length - 1) / 2;
	var ruleNodes = [];

	for (
		var i = stepNumber > 0 ? 0 : lastIndex;
		stepNumber > 0 ? i <= lastIndex : i >= 0;
		i += stepNumber
	) {
		var itemNode = itemNodes[i * 2];
		this.scope.define(valueVariableName, itemNode);

		if (indexVariableNode) {
			var indexVariableName = indexVariableNode.children[0];
			var indexNode = {
				type: 'number',
				children: [i],
				loc: indexVariableNode.loc,
			};
			this.scope.define(indexVariableName, indexNode);
		}

		var isLast = i === (stepNumber > 0 ? lastIndex : 0);
		var ruleListClone = isLast ? ruleListNode : Node.clone(ruleListNode);
		this.visit(ruleListClone.children);
		ruleNodes = ruleNodes.concat(ruleListClone.children);
	}

	return ruleNodes;
};