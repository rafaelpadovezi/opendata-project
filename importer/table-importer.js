var MongoClient = require('mongodb').MongoClient;
var Parser = require('./parser');
var async = require('async');
var Q = require('q');
var file = require('file');
var utils = require('./parser/utils');

var url = 'mongodb://localhost:27017/opendata-project';
var wbdfiles = [];
var miscFiles = [];
var countriesFile = 'datafiles/worldbank/Metadata_Country.csv';
var countryData;

MongoClient.connect(url, connect);

function connect(err, db) {
  if(err) { return console.log(err); }
  var countriesCollection = db.collection('countries');
  var indicatorsCollection = db.collection('indicators');
  
 return Q.nfcall(Parser.parseCountries, countriesFile)
    .then(loadCountries)
    .then(parseIndicators)
    .then(loadIndicators)
    .then(function(results) {
      console.log(results);
    })
    .fail(onFail)
    .fin(function() {
      db.close();
    });
  
  function loadCountries(countries) {
    countryData = countries;
    var inserts = [];
    countries.forEach(function(country) {
      if (country._id === '') { return; }
      inserts.push(function(callback) {
        countriesCollection.updateOne({ _id: country._id}, country, { upsert: true }, callback);  
      });
    });
    return Q.nfcall(async.parallel, inserts);
  }
  
  function parseIndicators() {
    var parsers = [];
    wbdfiles.forEach(function(file) {
      parsers.push(function(callback) {
        Parser.parseWorldbankData(file, callback); 
      });
    });
    miscFiles.forEach(function(file) {
        if (utils.file.getExtension(file) === '.txt') {
          parsers.push(function(callback) {
              Parser.parseTxtFile(file, callback);
          });
        }
        if (utils.file.getExtension(file) === '.csv') {
          parsers.push(function(callback) {
              Parser.parseCsvFile(file, callback);
          });
        }
    });
    return Q.nfcall(async.parallel, parsers);
  }
  
  function loadIndicators(indicators) {
    var indicatorArray = [];
    var inserts = [];
    indicators.forEach(function(item) {
      item.forEach(function(indicator) {
        if (!indicator.country) {
        indicator.country = getCountryCode(countryData, indicator.countryName);
        }
        if (indicator.country) {
          inserts.push(function(callback) {
            indicatorsCollection.insertOne(indicator, callback);
          });
        }  
      });
      
    });
    
    return Q.nfcall(async.parallel, inserts);
  }
  
}

function onFail(err) {
  if(err) { return console.log(err); }
}

file.walk(__dirname + '/datafiles/worldbank/', walkWbdFiles);

function walkWbdFiles(err, dirPath, dirs, files) {
  if (err) { return console.log(err); }
  
  var dirname = utils.file.getDirname(dirPath);
  if (dirname === 'worldbank') { return; }
  files.forEach(function(item) {
    if (utils.file.getFilename(item).indexOf(dirname) === 0) {
      wbdfiles.push(item);
    }
  });
}

file.walk(__dirname + '/datafiles/misc/', walkMiscFiles);

function walkMiscFiles(err, dirPath, dirs, files) {
  if (err) { return console.log(err); }
  files.forEach(function(item) {
    miscFiles.push(item);
  });
}

function getCountryCode(countries, name) {

  var filtered = countries.filter(function(item) {
    return item.name == name;
  });
  
  return filtered.length > 0? filtered[0]: undefined;
}