var fs = require('fs')
    , util = require('util')
    , stream = require('stream')
    , es = require("event-stream");

var lineNr = 1;

module.exports = read;

function read(filename, callback, done) {
  var s = fs.createReadStream(filename)
    .pipe(es.split())
    .pipe(es.mapSync(function(line){
      s.pause();

      lineNr += 1;
      (function(){
        callback(null, line);
        lineNr += 1;
        // resume the readstream
        s.resume();
      })();
  })
  .on('error', function(err){
    callback(err);
  })
  .on('end', function(){
    if(done)
      done();
  }));
}
