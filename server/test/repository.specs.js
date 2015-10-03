var chai = require('chai');
chai.use(require('chai-as-promised'));
var should = chai.should();

var rewire = require('rewire');
var repository = rewire('./repository');
//repository.__set__('database', require('mocks/database'));

var queryString = "";

describe('repository', function() {
  it('should get some data', function() {
    
  });
});
