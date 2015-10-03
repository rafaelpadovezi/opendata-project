var chai = require('chai');
var expect = chai.expect;

var csvFile = '\"INDICATOR_CODE\",\"INDICATOR_NAME\",\"SOURCE_NOTE\",\"SOURCE_ORGANIZATION\",\n' +
'\"SE.XPD.TOTL.GB.ZS\",\"Government expenditure on education, total (% of government expenditure)\",\"General government expenditure on education (current, capital, and transfers) is expressed as a percentage of total general government expenditure on all sectors (including health, education, social services, etc.). It includes expenditure funded by transfers from international sources to government. General government usually refers to local, regional and central governments.\",\"UNESCO Institute for Statistics\",';

var value = 'General government expenditure on education (current, capital, and transfers) is expressed as a percentage of total general government expenditure on all sectors (including health, education, social services, etc.). It includes expenditure funded by transfers from international sources to government. General government usually refers to local, regional and central governments.';

var anotherLine = '"Algeria",NA,NA,NA,NA,NA,2.6,2.7,2.8,3.1,3,3.2,2.8,2.9,2.9,34,36,36';

var utils = require('../parser/utils');

describe('utils', function() {
  it('should split cvs line', function() {
    var lines = csvFile.split(/[\r\n]+/g);
  
    var output = utils.splitCsvLine(lines[1]);
    
    expect(output[2]).to.equal(value);
  });
  
  it('should split another line', function() {
    var output = utils.splitCsvLine(anotherLine);
    expect(output[0]).to.equal('Algeria');
    expect(output[6]).to.equal('2.6');
  });
});