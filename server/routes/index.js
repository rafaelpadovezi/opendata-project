var repository = require('../repository');

module.exports = configureRoutes;

function configureRoutes(app) {
  app.get('/api/Metadata', getMetadata);
  app.get('/api/:resource', getQuery);
}

function getQuery(req, res, next) {
  var method = parseResource(req.params.resource);
  method(req.query)
    .then(makeResponseHandler(res, next))
    .fail(errorHandler(next));
}

function getMetadata(req, res, next) {
  next({
    statusCode: 404,
    message: "No metadata from the server; metadata is defined on the client"
  });
}

function parseResource(resource) {
  switch (resource) {
    case 'Country':
      return repository.getCountries;
      break;
    case 'Indicator':
      return repository.getIndicators;
      break;
    case 'IndicatorList':
      return repository.getIndicatorList;
    case 'Budget':
      return repository.getBudget;
    default:
      // code
  }
}

function makeResponseHandler(res, next) {
  return function(results) {
    res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.setHeader("Content-Type:", "application/json");
    res.send( JSON.stringify(results) );
  };
}

function errorHandler(next) {
  return function(err) {
    next(err);
  };
}