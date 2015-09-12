var MongoClient = require('mongodb').MongoClient;
var Parser = require('./parser');
var async = require('async');
var Q = require('q');

var url = 'mongodb://localhost:27017/opendata-project';
var wbdfiles = [
  'datafiles/worldbank/gc.dod.totl.gd.zs/gc.dod.totl.gd.zs_Indicator_en_csv_v2.csv',
  'datafiles/worldbank/ny.gdp.mktp.kd.zg/ny.gdp.mktp.kd.zg_Indicator_en_csv_v2.csv',
  'datafiles/worldbank/se.xpd.totl.gb.zs/se.xpd.totl.gb.zs_Indicator_en_csv_v2.csv'
];
var miscFiles = [
  'datafiles/hdi.txt',
  'datafiles/cpi.csv'
];

var countriesFile = 'datafiles/worldbank/Metadata_Country.csv';

MongoClient.connect(url, connect);

function connect(err, db) {
  if(err) { return console.log(err); }
  var collection = db.collection('countries');
  
  return Q.nfcall(Parser.parseCountries, countriesFile)
    .then(parseCountries)
    .then(onCountryDataLoad)
    .then(parseWorldbankData)
    .then(function(results) {
      console.log('Loaded worldbank data!');
      return Q.nfcall(Parser.parseTxtFile, miscFiles[0]);
    })
    .then(function(countries) {
      var updates = [];
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
      
      return Q.nfcall(async.parallel, updates);
    })
    .then(function(results) {
      console.log('HDI data loaded!');
      return Q.nfcall(Parser.parseCsvFile, miscFiles[1]);
    })
    .then(function(countries) {
      var updates = [];
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
      
      return Q.nfcall(async.parallel, updates);
    })
    .then(function() {
      console.log('CPI data loaded!');
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