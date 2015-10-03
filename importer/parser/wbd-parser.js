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

    var indicatorArray = results[0];
    var indicatorMetadata = results[1];
    
    indicatorArray.forEach(merge);
    
    callback(null, indicatorArray);
    
    function merge(indicator) {
      indicator.description = indicatorMetadata.description;
    }
  }
}

function parseData(filename, callback) {
  
  fs.readFile(filename, readfile);

  function readfile(err, data) {
    var indicatorArray = [];
    if(err) return callback(err);

    var text = data.toString().split(/[\r\n]+/g);
    var dataSource = splitCsvLine(text[0])[1];
    text.splice(0, 2);
    var yearsArray = splitCsvLine(text.shift());
    
    yearsArray.splice(0, 4);

    text.forEach(parseRow);

    callback(null, indicatorArray);
    
    function parseRow(item) {
      var row = splitCsvLine(item);
      var countryName = row.shift();
      if(countryName === '') { return; }
      var countryCode = row.shift();
      var indicatorName = row.shift();
      var indicator = row.shift();

      var registry = {
        code : indicator,
        name: indicatorName,
        source: dataSource,
        countryName: countryName,
        country: countryCode
      };
      
      registry.values = parseDataRow(row, yearsArray);

      indicatorArray.push(registry);
    }
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
    
    callback(null, indicator);
  }
}