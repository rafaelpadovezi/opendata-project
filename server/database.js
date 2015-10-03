var Q = require('q');
var MongoClient = require('mongodb').MongoClient;

module.exports.getDb = getDb;

var db = null;

var mongourl = 'mongodb://localhost:27017/opendata-project';
var mongoOptions = {
  server: {auto_reconect: true}
};

function getDb() {
  return Q.promise(theDb);
  
  function theDb(resolve, reject, notify) {
    if (db) {
      resolve(db);
    } else {
      MongoClient.connect(mongourl, mongoOptions, function(err, theDb) {
        if(err) {
          err.message = (err.message || '')+'. Is the MongoDb server running?';
          reject(err);
        } else {
          db = theDb;
          resolve(db);
        }
      });
    }
  }
}