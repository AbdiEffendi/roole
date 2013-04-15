/**
 * Helper
 *
 * A collection of general utility functions used by other modules.
 */
'use strict';

var _ = exports;

_.noop = function() {};

_.mixin = function(target) {
	for (var i = 1, len = arguments.length; i < len; ++i) {
		var obj = arguments[i];
		for (var k in obj) {
			if (obj.hasOwnProperty(k) && obj[k] !== undefined) {
				target[k] = obj[k];
			}
		}
	}

	return target;
};

_.clone = function(obj) {
	return _.mixin({}, obj);
};

_.capitalize = function(string) {
	return string.charAt(0).toUpperCase() + string.substr(1);
};

// shallow flatten
_.flatten = function(array) {
	var flattenedArray = [];

	array.forEach(function(item) {
		if (Array.isArray(item)) {
			flattenedArray = flattenedArray.concat(item);
		} else {
			flattenedArray.push(item);
		}
	});

	return flattenedArray;
};

_.intersect = function(arr1, arr2) {
	return arr1.filter(function(item) {
		return arr2.indexOf(item) !== -1;
	});
};

_.dirname = function(path) {
	if (!path) {
		return '.';
	}

	var parts = path.split('/');
	parts.pop();
	return parts.join('/') || '.';
};

_.joinPaths = function(path1, path2) {
	return _.normalizePath(path1 + '/' + path2);
};

_.normalizePath = function (path) {
	var parts = path.split('/').filter(function(p) {
		return p;
	});

	var i = parts.length;
	var up = 0;
	var last;

	while (--i >= 0) {
		last = parts[i];

		if (last === '.') {
			parts.splice(i, 1);
		} else if (last === '..') {
			parts.splice(i, 1);
			++up;
		} else if (up) {
			parts.splice(i, 1);
			--up;
		}
	}

	return parts.join('/');
};