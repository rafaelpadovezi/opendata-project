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

MongoClient.connect(url, connect);

function connect(err, db) {
  if(err) { return console.log(err); }
  var collection = db.collection('countries');
  
  return Q.nfcall(Parser.parseCountries, countriesFile)
    .then(parseCountries)
    .then(onCountryDataLoad)
    .then(parseWorldbankData)
    .then(onWorldbankDataLoad)
    .then(parseMiscFiles)
    .then(function(results) {
      console.log('Misc data loaded!');
    })
    .fail(onFail)
    .fin(function() {
      db.close();
    });
  
  function parseCountries(countries) {
    var inserts = [];
    countries.forEach(function(country) {
      if (country._id === '') { return; }
      inserts.push(function(callback) {
        collection.updateOne({ _id: country._id}, country, { upsert: true }, callback);  
      });
    });
    return Q.nfcall(async.parallel, inserts);
  }
  
  function onCountryDataLoad(results) {
    console.log('Loaded country data!');
    var parsers = [];
    wbdfiles.forEach(function(file) {
      parsers.push(function(callback) {
        Parser.parseWorldbankData(file, callback); 
      });
    });
    
    return Q.nfcall(async.parallel, parsers);
  }
  
  function onWorldbankDataLoad(results) {
    console.log('Loaded worldbank data!');
    var parsers = [];
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
  
  function parseMiscFiles(results) {
    var updates = [];
    
    results.forEach(function(countries) {
      countries.forEach(function(country) {
        var setExpression = { };
        Object.keys(country).forEach(function(key) {
          if (key === 'name') { return; }
          setExpression[key] =  country[key];
        });
       
        updates.push(function(callback) {
          collection.updateOne({name: country.name}, { $set: setExpression }, callback); 
        });
      });
    });
    
    return Q.nfcall(async.parallel, updates);
  }
  
  function parseWorldbankData(results) {
    
    var updates = [];
    results.forEach(function(countries) {
      countries.forEach(function(country) {
        if (country._id === '') { return; }
        var setExpression = { };
        
        Object.keys(country).forEach(function(key) {
          if(key === '_id') { return; }
          setExpression[key.replace(/[.]/g,'')] = country[key];
        });
        updates.push(function(callback) {
          collection.updateOne({ _id: country._id}, { $set: setExpression }, callback); 
        });
      });
    });

    return Q.nfcall(async.parallel, updates);
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
  files.forEach(function(item) {
    miscFiles.push(item);
  });
}