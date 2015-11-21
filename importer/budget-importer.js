var utils = require('./parser/utils');
var fs = require('fs');
var util = require('util');

var filename = 'datafiles/budget/mg2011.txt';

fs.readFile(filename, function(err, data) {
	if (err)
		return console.log(err);
	
	var root = {
		code: 'BRA-MG',
		name: 'Minas Gerais',
		year: '2011',
		children: [ ]
	};
	var table = data.toString().split(/[\r\n]+/g);
	table.forEach(function(row) {
		var item = row.split('\t');
		
		var child = root.children.filter(function(node) {
			return node.code === item[0];
		});
		if (child.length === 0) {
			child = {
				code: item[0],
				name: item[1],
				children : []		
			};
			root.children.push(child);
		} else {
			child = child[0];
		}
		
		child.children .push({
			code: item[2],
			name: item[3],
			size: Number(item[4])
		});
	});
	console.log(util.inspect(root, false, null));	
});