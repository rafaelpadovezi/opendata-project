module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    if (err) {
        var body =  err.message || err;
        var status = err.statusCode || 500;
        res.status(status).send(body);
        logError(err, status, body);
    }
}

function logError(err, status, body){
    //todo: get environment variable that says whether to log to console
    setTimeout(log,0); // let response write to console, then error
    function log(){
        var stack = '';
        var msg = '--------------\n'+status + ' ' + body;
        // log all inner errors too
        while(err) {
            stack = err.stack || stack; // get deepest stack
            err = err.innerError;
            if (err && err.message){
                msg += '\n'+err.message;
            }
        }
        // log deepest stack
        if(stack) {msg += '\n'+stack; }
        console.error(msg+'\n--------------');
    }
}
