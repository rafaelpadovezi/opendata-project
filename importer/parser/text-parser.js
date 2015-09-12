var fs = require('fs');
var utils = require('./utils');

var splitCsvLine = utils.splitCsvLine;
var parseDataRow = utils.parseDataRow;

module.exports = textParser;

function textParser(filename, separator, callback) {
  fs.readFile(filename, readfile);

  function readfile(err, data) {
    var countries = [];
    if(err) return callback(err);

    var text = data.toString().replace(/"/gi, '').split(/[\r\n]+/g);
    var yearsArray = text.shift().split(separator);
    yearsArray.shift();
    var indicator = filename.substr(filename.lastIndexOf('/') + 1).split('.')[0].toLowerCase();

    text.forEach(parseRow);

    function parseRow(item) {
      var row = item.split(separator);
      var countryName = row.shift();

      var country = {
        name: countryName,
      };
      country[indicator] = { };
      
      country[indicator].values = parseDataRow(row, yearsArray);

      countries.push(country);
    }

    callback(null, countries);
  }
}
