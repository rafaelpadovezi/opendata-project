var chai = require('chai');
var expect = chai.expect;
var parser = require('../parser');
var filename1 = 'datafiles/worldbank/gc.dod.totl.gd.zs/gc.dod.totl.gd.zs_Indicator_en_csv_v2.csv';

describe('parser', function() {
  it('should successfully call the wdbParser function', function(done) {
    parser.parseWorldbankData(filename1, function(err, results) {
      expect(err).to.equal(null);
      expect(results[40]).to.deep.equal(camaroonData);
      done();
    });
  });
  
  it('should successfully call the textParser function with a \'\\t\' parameter', function(done) {
     parser.parseTxtFile('datafiles/hdi.txt', function(err, results) {
       expect(err).to.equal(null);
      expect(results[29]).to.deep.equal(brazilHdi);
      done();
     }) ;
  });
});

var camaroonData = { _id: 'CMR',
  name: 'Cameroon',
  'GC.DOD.TOTL.GD.ZS': 
   { name: 'Central government debt, total (% of GDP)',
     source: 'International Monetary Fund, Government Finance Statistics Yearbook and data files, and World Bank and OECD GDP estimates.',
     values: 
      [ { '1990': '35.6686948009612' },
        { '1991': '48.8665341962956' },
        { '1992': '58.646137344434' },
        { '1993': '62.0099992893703' },
        { '1994': '131.441710220622' },
        { '1995': '127.254371657715' },
        { '1998': '97.4988586088011' },
        { '1999': '91.6629364938047' } ],
     description: 'Debt is the entire stock of direct government fixed-term contractual obligations to others outstanding on a particular date. It includes domestic and foreign liabilities such as currency and money deposits, securities other than shares, and loans. It is the gross amount of government liabilities reduced by the amount of equity and financial derivatives held by the government. Because debt is a stock rather than a flow, it is measured as of a given date, usually the last day of the fiscal year.' } };
     
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