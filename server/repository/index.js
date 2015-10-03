var Q = require('q');
var bmongo = require('breeze-mongodb');
var getDb = require('../database').getDb;

module.exports = {
  getCountries: getCountries
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