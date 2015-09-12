function splitCsvLine(line) {
  return line.substr(0, line.length - 2).substr(1, line.length - 3).split('","');
}

function parseDataRow(row, years) {
  var values = [];
  row.forEach(function(item, index) {
    var exists = item !== '' && item !== 'NA';
    if(!exists) { return; }
    
    values.push({
      year: years[index],
      value: item
    });
  });
  
  return values;
}

function stripColumns(table, columns) {
  
}

module.exports = {
  splitCsvLine: splitCsvLine,
  parseDataRow: parseDataRow
};