var request = require('request');
var fileReader = require('./file-reader');
var MongoClient = require('mongodb').MongoClient;
var async = require('async');

var mongodbUrl = 'mongodb://localhost:27017/opendata-project';
MongoClient.connect(mongodbUrl, function(err, db) {
  var brazilBudget = db.collection('brazilBudget');
  var lastUrl = '';
  var count = 0;

  fileReader('C:\\workspace\\data\\loa2014.nt', function(err, line) {
    if (err) { return console.log('Reading line: ' + err); }
    count += 1;
    var url = line.substr(1, line.indexOf('>') - 1);
    if (url === lastUrl) return;

    work.push(url);

    lastUrl = url;
  }, function() {
    console.log("Read " + count + " lines.");
  });

  var work = async.queue(function(url, done) {
    request(url + '.json', getItem);

    function getItem (error, response, body) {
      if (err) {
      console.log('err in ' + url);
      return done();
      }
      if (!response) {
        console.log('err in ' + url + '. No response.');
        return done();
      }
      if (response.statusCode != 200) {
        console.log('err in ' + url + '. Got a ' + response.statusCode);
        return done();
      }
      if (!error && response.statusCode == 200) {
        var result = JSON.parse(body).result;
        var item = parseResponse(result);
        brazilBudget.insert(item, function(err, result) {
          if (err) {
            console.log('mongoerr in ' + url);
            return done();
          }
          done();
        });
      }
    }
  }, 20);

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
