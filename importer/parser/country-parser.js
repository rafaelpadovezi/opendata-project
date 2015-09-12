var fs = require('fs');
var splitCsvLine = require('./utils').splitCsvLine;

module.exports = parseCountries;

function parseCountries(filename, callback) {
  fs.readFile(filename, readFile);
  
  function readFile(err, data) {
    if(err) { return callback(err); }
    
    var text = data.toString().split(/[\r\n]+/g);
    text.shift();
    
    var countries = [];
    text.forEach(parseRow);
    
    callback(null, countries);
    
    function parseRow(item) {
      var row = splitCsvLine(item);
      var countryName = row.shift();
      if (countryName === '') { return; }
      
      var country = {
        _id: row[0],
        name: countryName,
        region: row[1],
        classBy: { 'worldbank': row[2] }
      };
      countries.push(country);
    }
  }
}