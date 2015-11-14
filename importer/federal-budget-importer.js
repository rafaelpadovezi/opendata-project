var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var LineByLineReader = require('line-by-line');
var lr = new LineByLineReader('C:\\workspace\\data\\loa2014.nt');
var concurrency = 20;
var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'debug-file',
      filename: 'filelog-debug.log',
      level: 'debug'
    }),
    new (winston.transports.File)({
      name: 'info-file',
      filename: 'filelog-info.log',
      level: 'info'
    }),
    new (winston.transports.Console)({
      level: 'error'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: 'filelog-error.log',
      level: 'error'
    })
  ]
});

var mongodbUrl = 'mongodb://localhost:27017/opendata-project';
MongoClient.connect(mongodbUrl, function(err, db) {
  var brazilBudget = db.collection('brazilBudget');
  var lastUrl = '';
  var count = 0;

  lr.on('error', function (err) {
    logger.error(err);
    console.log(err);
  });

  lr.on('line', function (line) {
      count += 1;
      var url = line.substr(1, line.indexOf('>') - 1);
      if (url === lastUrl) return;

      //logger.debug('Read ' + url + '...');
      work.push(url, function(err) {
        lr.resume();
        //logger.debug('resume read... Now ' + work.running() + ' workers');
        if (err) { return console.log(err); }
      });
      lastUrl = url;
  });

  lr.on('end', function () {
    db.close();
    console.log('done!');
  });

  var work = async.queue(function(url, done) {
    logger.debug('Requisting ' + url + '...');
    request({url: url + '.json', timeout: 20000}, getItem);

    function getItem (err, response, body) {
      if (err) {
        logger.error(err);
        logger.info(url);
        return done(err);
      }
      if (!response) {
        logger.info(url);
        logger.error('No response in ' + url);
        return done();
      }
      //('Got ' + response.statusCode + ' in ' + url + '...');
      if (response.statusCode != 200) {
        logger.info(url);
        logger.error('err in ' + url + '. Got a ' + response.statusCode);
        return done();
      }
      if (!err && response.statusCode == 200) {
        //logger.debug('Got OK in ' + url + '...');
        var result = JSON.parse(body).result;
        var item = parseResponse(result);
        brazilBudget.insert(item, function(err, result) {
          if (err) {
            logger.error(err);
            logger.info(url);
            return done(err);
          }
          //logger.debug('Added data from ' + url + '...');
          done();
        });
      }
    }
  }, concurrency);

  work.saturated = function() {
    //logger.debug('pause read...');
    lr.pause();
  };

  work.drain = function() {
    console.log('Done!');
    db.close();
  };
});

function parseResponse(result) {
  return {
    funcao : result.primaryTopic.temFuncao.label[0],
    temUnidadeOrcamentaria : result.primaryTopic.temUnidadeOrcamentaria.label[0],
    modalidade : result.primaryTopic.temModalidadeAplicacao.label[0],
    subfuncao : result.primaryTopic.temSubfuncao.label[0],
    fonteRecursos : result.primaryTopic.temFonteRecursos.label[0],
    categoriaEconomica : result.primaryTopic.temCategoriaEconomica.label[0],
    valor : {
      empenhado : result.primaryTopic.valorEmpenhado,
      dotacaoInicial : result.primaryTopic.valorDotacaoInicial,
      liquidado : result.primaryTopic.valorLiquidado,
      leiMaisCredito : result.primaryTopic.valorLeiMaisCredito,
      pago : result.primaryTopic.valorPago,
      projetoLei : result.primaryTopic.valorProjetoLei
    }
  };
}
