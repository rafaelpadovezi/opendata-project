if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (position === undefined || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}

function splitCsvLine(line) {
  var array = line.split(/[,]/g);
  array.forEach(function(item, index) {
    if (item.startsWith('"')) {
      if (item.endsWith('"')) {
        array[index] = item.substr(1, item.length - 2);
      }
      else {
        if ((!array[index + 1].startsWith('"')) && array[index + 1].endsWith('"')) {
          array[index] = item.substr(1) + ',' + array[index + 1].substr(0, array[index + 1].length - 1);
          array.splice(index + 1, 1);
        }
      }
    }
  });
  return array;//line.substr(0, line.length - 2).substr(1, line.length - 3).split('","');
}

function parseDataRow(row, years) {
  var values = [];
  row.forEach(function(item, index) {
    var exists = item !== '' && item !== 'NA';
    if(!exists) { return; }
    
    values.push({
      year: Number(years[index]),
      value: Number(item.replace(/[,]/g, '.'))
    });
  });
  
  return values;
}

function getExtension(filename) {
  return filename.substr(filename.lastIndexOf('.'));
}

function isTxt(filename) {
  return getExtension(filename) === '.txt';
}

function isCsv(filename) {
  return getExtension(filename) === '.csv';
}

function getFilename(filename) {
  filename = filename.substr(0, filename.lastIndexOf('.'));
  return filename.substr(filename.lastIndexOf('/') + 1);
}

function getDirname(dirPath) {
  if (dirPath.endsWith('/')) {
    dirPath = dirPath.substr(0, dirPath.length - 1);
  }
  
  return dirPath.substr(dirPath.lastIndexOf('/') + 1, dirPath.length - 1);
}

module.exports = {
  splitCsvLine: splitCsvLine,
  parseDataRow: parseDataRow,
  file: {
    getExtension: getExtension,
    isCsv: isCsv,
    isTxt: isTxt,
    getFilename: getFilename,
    getDirname: getDirname
  }
};