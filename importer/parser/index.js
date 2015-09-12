var countryParser = require('./country-parser');
var textParser = require('./text-parser');
var csvParser = require('./csv-parser');
var wbdParser = require('./wbd-parser');

module.exports = {
  parseCountries: countryParser,
  parseTxtFile: textParser,
  parseCsvFile: csvParser,
  parseWorldbankData: wbdParser
};
