var express        = require('express')
    , app          = express()
    , bodyParser   = require('body-parser')
    , compress     = require('compression')
    , cors         = require('cors')
    , errorHandler = require('./error-handler')
    , favicon      = require('static-favicon')
    , fileServer   = require('serve-static')
    , logger       = require('morgan')
    , port         = process.env["PORT"] || 7999
    , hostname     = process.env["IP"]
    , routes       = require('./routes'); 

app.use( favicon());
app.use( logger('dev'));
app.use( compress());
app.use( bodyParser()); // both json & urlencoded
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
// Support static file content
// Consider 'st' module for caching: https://github.com/isaacs/st
app.use( fileServer( __dirname+'/../client' )); // was fileServer( process.cwd() )

app.use(cors());          // enable ALL CORS requests

//routes
routes(app);

// this middleware goes last to catches anything left
// in the pipeline and reports to client as an error
app.use(errorHandler);

// create server (in case interested in socket.io)
app.listen(port, hostname, function() {
    console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname +
        '\nprocess.cwd = ' + process.cwd() +
        '\nNode Server is listening on port ' + port);
});
