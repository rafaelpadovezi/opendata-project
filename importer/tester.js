var textParser = require('./parser/text-parser');
var wbdParser = require('./parser/wbd-parser');
var countryParser = require('./parser/country-parser');
var async = require('async');
var countries = [];
var util = require('util');
var Parser = require('./parser');

/*async.parallel([
  textParser('hdi.txt', '\t'),
  textParser('cpi.csv', ',')
])*/
/*textParser('datafiles/hdi.txt', '\t', function(err, result) {
  console.log(util.inspect(result[29], false, null));
});

textParser('datafiles/cpi.csv', ',', function(err, result) {
  console.log(util.inspect(result[21], false, null));
});*/

Parser.parseTxtFile('datafiles/misc/hdi.txt', function(err, result) {
  console.log(util.inspect(result[29], false, null));
});

Parser.parseCsvFile('datafiles/misc/cpi.csv', function(err, result) {
  console.log(util.inspect(result[21], false, null));
});

/*wbdParser('datafiles/worldbank/gc.dod.totl.gd.zs/gc.dod.totl.gd.zs_Indicator_en_csv_v2.csv',
  function(err, result) {
    if (err) return console.log(err);
    console.log(util.inspect(result[40], false, null));
    //console.log(result[40]);
  });
*/
wbdParser('datafiles/worldbank/ny.gdp.mktp.kd.zg/ny.gdp.mktp.kd.zg_Indicator_en_csv_v2.csv',
function(err, result) {
    if (err) return console.log(err);
    console.log(util.inspect(result[27], false, null));
    //console.log(result[40]);
  });

/*countryParser('datafiles/worldbank/Metadata_Country.csv',
  function(err, result) {
    /*if (err) { return console.log(err); }
    result.filter(function(item) {
      return item._id === '';
    }).forEach(function(item) {
      console.log(util.inspect(item, false, null));
    });
    console.log(util.inspect(result[28], false, null));
  });*/