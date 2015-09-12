var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
chai.use(require('chai-things'));
var textParser = require('../parser/text-parser');

describe('textParser', function() {
  it('should parse txt file', function(done) {
    textParser('datafiles/hdi.txt', '\t', function(err, results) {
      expect(err).to.equal(null);
      expect(results[29]).to.deep.equal(brazilHdi);
      done();
    });
  });

  it('should parse a csv file', function(done) {
    textParser('datafiles/cpi.csv', ',', function(err, results) {
      expect(err).to.equal(null);
      expect(results[21]).to.deep.equal(brazilCpi);
      done();
    });
  });
});

var brazilHdi = { name: 'Brazil',
  hdi: 
   { values: 
      [ { '1980': '0,549' },
        { '1990': '0,6' },
        { '2000': '0,665' },
        { '2005': '0,692' },
        { '2006': '0,695' },
        { '2007': '0,7' },
        { '2008': '0,705' },
        { '2009': '0,708' },
        { '2011': '0,718' } ] } };

var brazilCpi = { name: 'Brazil',
  cpi: 
   { values: 
      [ { '1998': '4' },
        { '1999': '4.1' },
        { '2000': '3.9' },
        { '2001': '4' },
        { '2002': '4' },
        { '2003': '3.9' },
        { '2004': '3.9' },
        { '2005': '3.7' },
        { '2006': '3.3' },
        { '2007': '3.5' },
        { '2008': '3.5' },
        { '2009': '3.7' },
        { '2010': '3.7' },
        { '2011': '3.77' },
        { '2012': '43' },
        { '2013': '42' },
        { '2014': '43' } ] } }
