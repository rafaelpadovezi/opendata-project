var fs = require('fs');
var utils = require('./utils');

var parseDataRow = utils.parseDataRow;

module.exports = textParser;

function textParser(filename, separator, callback) {
  if (typeof separator === 'function') {
    callback = separator;
    separator = '\t';
  }
  fs.readFile(filename, readfile);

  function readfile(err, data) {
    var indicatorArray = [];
    if(err) return callback(err);

    var text = data.toString().split(/[\r\n]+/g);
    var yearsArray = text.shift().split(separator);
    yearsArray.shift();
    var indicator = filename.substr(filename.lastIndexOf('/') + 1).split('.')[0].toLowerCase();

    text.forEach(parseRow);
    
    callback(null, indicatorArray);
    
    function parseRow(item) {
      var row = item.split(separator);
      
      var registry = {
        code: indicator,
        countryName: row.shift()
      };
      
      registry.values = parseDataRow(row, yearsArray);

      indicatorArray.push(registry);
    }
  }
}
