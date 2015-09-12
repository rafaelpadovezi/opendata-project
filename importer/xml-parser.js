'use strict';

var fs = require('fs');
var xml2js = require('xml2js');

var parser = new xml2js.Parser();

module.exports = parseXml;

function parseXml(filename, callback) {
  fs.readFile(filename, function(err, data) {
    if (err) { return callback(err); }
    
    var countries = [];
    parser.parseString(data.toString(), processData);
    
    function processData(err, result) {
      if(err) { return callback(err); }
      
      var records = result.Root.data[0].record;
      
      records.forEach(function(record) {
        var country = {
          _id: record.field[0].$.key,
          name: record.field[0]._
        };
        country[record.field[1].$.key] = record.field[1]._;
      });
      
      callback(null, records);
    }
  });
}