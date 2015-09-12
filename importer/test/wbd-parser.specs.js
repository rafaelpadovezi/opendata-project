var chai = require('chai');
var expect = chai.expect;
var wbdParser = require('../parser/wbd-parser');
var filename1 = 'datafiles/worldbank/gc.dod.totl.gd.zs/gc.dod.totl.gd.zs_Indicator_en_csv_v2.csv';
var filename2 = 'datafiles/worldbank/ny.gdp.mktp.kd.zg/ny.gdp.mktp.kd.zg_Indicator_en_csv_v2.csv';

describe('wbdParser', function() {
  it('it should import worldbank csv file', function(done) {
    wbdParser(filename1, function(err, results) {
      expect(err).to.equal(null);
      expect(results[40]).to.deep.equal(camaroonData);
      done();
    });
  });
  
  it('it should import another worldbank csv file', function(done) {
    wbdParser(filename2, function(err, results) {
      expect(err).to.equal(null);
      expect(results[27]).to.deep.equal(brazilData);
      done();
    });
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
        
var brazilData = { _id: 'BRA',
  name: 'Brazil',
  'NY.GDP.MKTP.KD.ZG': 
   { name: 'GDP growth (annual %)',
     source: 'World Bank national accounts data, and OECD National Accounts data files.',
     values: 
      [ { '1961': '10.2759115543009' },
        { '1962': '5.21605942017888' },
        { '1963': '0.87467259240843' },
        { '1964': '3.48558230427724' },
        { '1965': '3.0534878936691' },
        { '1966': '4.15036023303344' },
        { '1967': '4.91526567501121' },
        { '1968': '11.4272823832673' },
        { '1969': '9.7358268899127' },
        { '1970': '8.76994747172606' },
        { '1971': '11.2950868433503' },
        { '1972': '12.0528022500388' },
        { '1973': '13.9786916510758' },
        { '1974': '9.04212031316958' },
        { '1975': '5.20907590114406' },
        { '1976': '9.79041016147607' },
        { '1977': '4.60631806113791' },
        { '1978': '3.23170956333544' },
        { '1979': '6.76628496532688' },
        { '1980': '9.11096015517153' },
        { '1981': '-4.39335720034832' },
        { '1982': '0.580245553394249' },
        { '1983': '-3.40979347371643' },
        { '1984': '5.26914314976869' },
        { '1985': '7.94586174871282' },
        { '1986': '7.98829510486232' },
        { '1987': '3.59962946680903' },
        { '1988': '-0.102672718383658' },
        { '1989': '3.27945885796419' },
        { '1990': '-3.10235594875041' },
        { '1991': '1.51193723789993' },
        { '1992': '-0.466913209800552' },
        { '1993': '4.66516898877852' },
        { '1994': '5.33455170247368' },
        { '1995': '4.41673135388506' },
        { '1996': '2.19005943322573' },
        { '1997': '3.38828000897225' },
        { '1998': '0.354845946043383' },
        { '1999': '0.490423083557715' },
        { '2000': '4.38302453253021' },
        { '2001': '1.27902466530881' },
        { '2002': '3.07172489105554' },
        { '2003': '1.22320541938372' },
        { '2004': '5.6606735304683' },
        { '2005': '3.14890004348749' },
        { '2006': '3.99932427622596' },
        { '2007': '6.00580182696642' },
        { '2008': '5.01931601343728' },
        { '2009': '-0.235978102299356' },
        { '2010': '7.57206715522901' },
        { '2011': '3.91638218841442' },
        { '2012': '1.76248880506849' },
        { '2013': '2.74369664950311' },
        { '2014': '0.144707354149404' } ],
     description: 'Annual percentage growth rate of GDP at market prices based on constant local currency. Aggregates are based on constant 2005 U.S. dollars. GDP is the sum of gross value added by all resident producers in the economy plus any product taxes and minus any subsidies not included in the value of the products. It is calculated without making deductions for depreciation of fabricated assets or for depletion and degradation of natural resources.' } };