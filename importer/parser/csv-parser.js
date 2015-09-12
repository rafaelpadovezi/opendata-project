var fs = require('fs');
var utils = require('./utils');

var splitCsvLine = utils.splitCsvLine;
var parseDataRow = utils.parseDataRow;

module.exports = csvParser;

function csvParser(filename, callback) {
  fs.readFile(filename, readFile);
  
  function readFile(err, data) {
    if(err) { return callback(err); }
    
    var text = data.toString().split(/[\r\n]+/g);
    var yearsArray = splitCsvLine(text.shift());
    yearsArray.shift();
    
    var indicator = filename.substr(filename.lastIndexOf('/') + 1).split('.')[0].toLowerCase();
    var countries = [];
    
    text.forEach(readRow);
    
    callback(null, countries);
    
    function readRow(rowItem) {
      var row = splitCsvLine(rowItem);
      var country = {
        name: row.shift()
      };
      
      country[indicator] = { };
      
      country[indicator].values = parseDataRow(row, yearsArray);

      countries.push(country);
    }
  }
}