var rewire = require('rewire');
var database = rewire('../../database');
database.__set__('MongoClient', require('mongo-mock').MongoClient);

module.exports = database;