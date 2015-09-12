var fs = require('fs');
var async = require('async');
var utils = require('./utils');

var splitCsvLine = utils.splitCsvLine;
var parseDataRow = utils.parseDataRow;

module.exports = wbdParser;

function wbdParser(filename, callback) {
  var path = filename.substr(0, filename.lastIndexOf('/') + 1);
  var file = filename.substr(filename.lastIndexOf('/') + 1);
  async.parallel([
    async.apply(parseData, filename),
    async.apply(parseIndicator, path + 'Metadata_Indicator_' + file)
  ],
    mergeData);
    
  function mergeData(err, results) {
    if(err) { return callback(err); }

    var countries = results[0];
    var indicator = results[1];
    
    countries.forEach(merge);
    
    callback(null, countries);
    
    function merge(country) {
      country[indicator.code].name = indicator.name;
      country[indicator.code].description = indicator.description;
      country[indicator.code].source = indicator.source;
    }
  }
}

function parseData(filename, callback) {
  
  fs.readFile(filename, readfile);

  function readfile(err, data) {
    var countries = [];
    if(err) return callback(err);

    var text = data.toString().split(/[\r\n]+/g);
    var dataSource = splitCsvLine(text[0])[1];
    text.splice(0, 2);
    var yearsArray = splitCsvLine(text.shift());
    
    yearsArray.splice(0, 4);

    text.forEach(parseRow);

    function parseRow(item) {
      var row = splitCsvLine(item);
      var countryName = row.shift();
      if(countryName === '') { return; }
      var countryCode = row.shift();
      var indicatorName = row.shift();
      var indicator = row.shift();

      var country = {
        _id: countryCode,
        name: countryName
      };
      country[indicator] = {
        name: indicatorName,
        source: dataSource
      };

      country[indicator].values = parseDataRow(row, yearsArray);

      countries.push(country);
    }

    callback(null, countries);
  }
}

function parseIndicator(filename, callback) {
  fs.readFile(filename, readFile);
  
  function readFile(err, data) {
    if(err) { return callback(err); }
    var text = data.toString().split(/[\r\n]+/g);
    text.shift();
    var row = splitCsvLine(text.shift());
    var indicator = {
      code: row[0],
      name: row[1],
      description: row[2],
      source: row[3]
    };
    
    callback(null, indicator)
  }
}