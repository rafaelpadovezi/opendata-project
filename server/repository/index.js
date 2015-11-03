var Q = require('q');
var bmongo = require('breeze-mongodb');
var getDb = require('../database').getDb;

module.exports = {
  getCountries: getCountries,
  getIndicators: getIndicators,
  getIndicatorList: getIndicatorList
};

function getCountries(queryString) {
  return Q.promise(theCountries);
  
  function theCountries(resolve, reject, notify) {
    getDb().then(queryDb);
    
    function queryDb(db) {
        var query = new bmongo.MongoQuery(queryString);
        query.execute(db, 'countries', function(err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    }
  }
}

function getIndicators(queryString) {
  return Q.promise(theIndicators);
  
  function theIndicators(resolve, reject, notify) {
    getDb().then(queryDb);
    
    function queryDb(db) {
        var query = new bmongo.MongoQuery(queryString);
        query.execute(db, 'indicators', function(err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    }
  }
}

function getIndicatorList() {
  return Q.promise(theIndicatorList);
  
  function theIndicatorList(resolve, reject, notify) {
    getDb().then(queryDb);
  
    function queryDb(db) {
      var pipeline =
        [ 
          { "$group": { "_id": { code: "$code", name: "$name" } } },
          {"$project": {_id: 0, code:"$_id.code", name: "$_id.name"}}
        ]
      
      var indicators = db.collection('indicators');
      indicators.aggregate(pipeline, function(err, result) {
        if(err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    }
  }
}