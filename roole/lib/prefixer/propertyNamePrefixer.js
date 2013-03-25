/**
 * PropertyNamePrefixer
 *
 * Prefix property name
 */
'use strict';

var _ = require('../helper');
var Visitor = require('../visitor');
var Node = require('../node');
var PropertyNamePrefixer = module.exports = function() {};

PropertyNamePrefixer.prototype = new Visitor();

PropertyNamePrefixer.prototype.prefix = function(propertyNameNode, options) {
	this.prefixes = options.prefixes;
	this.properties = options.properties;

	return this.visit(propertyNameNode);
};

PropertyNamePrefixer.prototype.visitIdentifier = function(identifierNode) {
	var propertyName = identifierNode.children[0];
	var prefixedPropertyNameNodes = [];

	var prefixes;
	switch (propertyName) {
	case 'box-sizing':
	case 'box-shadow':
	case 'border-radius':
		prefixes = _.intersect(this.prefixes, ['webkit', 'moz']);
		break;
	case 'user-select':
		prefixes = _.intersect(this.prefixes, ['webkit', 'moz', 'ms']);
		break;
	case 'transition-duration':
	case 'transition-property':
	case 'transition':
		prefixes = _.intersect(this.prefixes, ['webkit', 'moz', 'o']);
		break;
	case 'transform':
		prefixes = this.prefixes;
		break;
	default:
		return prefixedPropertyNameNodes;
	}

	prefixes.forEach(function(prefix) {
		var prefixedPropertyName = '-' + prefix + '-' + propertyName;
		if (this.properties) {
			var prefixedPropertyExists = this.properties.some(function(propertyNode) {
				var propertyNameNode = propertyNode.children[0];
				var propertyName = propertyNameNode.children[0];
				return prefixedPropertyName === propertyName;
			});
			if (prefixedPropertyExists) {
				return;
			}
		}

		var prefixedPropertyNameNode = Node.clone(identifierNode);
		prefixedPropertyNameNode.children[0] = prefixedPropertyName;
		prefixedPropertyNameNodes.push(prefixedPropertyNameNode);
	}, this);

	return prefixedPropertyNameNodes;
};