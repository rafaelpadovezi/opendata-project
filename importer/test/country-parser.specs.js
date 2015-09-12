var chai = require('chai');
var expect = chai.expect;
var countryParser = require('../parser/country-parser');

describe('countryParser', function() {
  it('should parse country metadata from a csv file', function(done) {
    countryParser('datafiles/worldbank/Metadata_Country.csv', function(err, result) {
      expect(err).to.equal(null);
      expect(result[28]).to.deep.equal(brazilData);
      done();
    });
  });
});

var brazilData = { _id: 'BRA',
  name: 'Brazil',
  region: 'Latin America & Caribbean',
  classBy: { worldbank: 'Upper middle income' } };