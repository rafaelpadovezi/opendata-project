var Q = require('q');
var bmongo = require('breeze-mongodb');
var getDb = require('../database').getDb;

module.exports = {
  getCountries: getCountries,
  getIndicators: getIndicators,
  getIndicatorList: getIndicatorList,
  getBudget: getBudget,
  getBudgetList: getBudgetList
};

function getBudget(queryString) {
  return Q.promise(theBudget);
  
  function theBudget(resolve, reject, notify) {
    getDb().then(queryDb);
    
    function queryDb(db) {
      var query = new bmongo.MongoQuery(queryString);
      query.execute(db, 'budgets', function(err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    }
  }
}

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
          {"$project": {_id: 0, code:"$_id.code", name: "$_id.name"}},
          { "$sort" : { name : 1 } }
        ];
      
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

function getBudgetList() {
  return Q.promise(theBudgetList);
  
  function theBudgetList(resolve, reject, notify) {
    getDb().then(queryDb);
    
    function queryDb(db) {
      var pipeline =
        [
          { "$group": {
          		"_id": { code: "$code", name: "$name"},
          		"years": {"$push": "$year" } } },
          { "$project": {
              _id: 0, code:"$_id.code",
              name: "$_id.name",
              years: "$years"}
          }
        ];

      var budgets = db.collection('budgets');
      budgets.aggregate(pipeline, function(err, result) {
        if(err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    }
  }
}