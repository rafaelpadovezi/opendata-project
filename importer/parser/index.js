var countryParser = require('./country-parser');
var textParser = require('./text-parser');
var wbdParser = require('./wbd-parser');

module.exports = {
  parseCountries: countryParser,
  parseTxtFile: parseTxtFile,
  parseCsvFile: parseCsvFile,
  parseWorldbankData: wbdParser
};

function parseTxtFile(filename, callback) {
  textParser(filename, '\t', callback);
}

function parseCsvFile(file, callback) {
  textParser(file, ',', callback);
}