///Model Dependencies////

var app = require('../app');
var debug = require('debug')('accounts:server');
var http = require('http');



///Get the enviorment and store it into express///

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

///Create HTTP server////
var server = http.createServer(app);

//Listen on provided port, on all network interfaces///
server.listen(port);
server.on('error, onError');
server.on('listenoing', onListening);


///Put the port into a string///
function normalizePort(val) {
    var port = parseInt(val, 10);
    if(isNaN(port)) {
        ///name the pipe////
        return val;
    }
    if(port>=0){
        //port number///
        return port;
    }
    return false
}

///Event Listener for HTTP server'error'

function onError(error) {
    if(error.syscall !== 'listen') {
        throw error;
        
    }

    var bind = typeof port === 'string'
    ? 'Pipe' + port
    : 'Port' + port;

    ///Hnadle specific errors with messages///
    switch(error.code) {
        case 'EACCES':
            console.error(bind + 'requires more access');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + 'is already in use');
            process.exit(1);
            break;
            default:
                throw error;
                
    }
    
}


function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
    ?'pipe' + addr
    :'port' + addr.port;
    debug('Listening on' + bind);
}