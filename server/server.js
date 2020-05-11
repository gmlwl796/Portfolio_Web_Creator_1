const http    = require('http');
const router = require('./routes/router');
const app = require('./config/express');
const server  = http.createServer(app);
//const port = 7777;
const host = "0.0.0.0";

var port = process.env.PORT || 3000; // 1

server.listen(port, host, serverStartCall);

function serverStartCall() {
    let addr = server.address();
    router(app);
    console.log(` ~ runserver ${addr.address}:${addr.port} ~`);
}
