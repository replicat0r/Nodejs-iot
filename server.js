var tls = require('tls')
var fs = require('fs')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 5000
var TLS_PORT = 2000
var incomingData



var options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('cert.pem'),

}


tls.createServer(options, function(s) {
    console.log('TLS connection established ')
    s.addListener('data', function(data) {
        incomingData = data
        console.log('Data Received Ok!')
    })

    console.log("TLS Client authorized:", s.authorized);
    if (!s.authorized) {
        console.log("TLS authorization error:", s.authorizationError);
    }

    console.log("Cipher: ", s.getCipher());
    console.log("Address: ", s.address());
    console.log("Remote address: ", s.remoteAddress);
    console.log("Remote port: ", s.remotePort);

    var fragment = '';
  
    socket.write('Ok')


    //   socket.write('Listening On Port ' + TLS_PORT)
    //   socket.write('You are listening on port '+ TLS_PORT + " Tom!")
    //socket.pipe(socket)




}).listen(TLS_PORT)



app.get('/', function(req, res) {
    res.sendfile('index.html');
});

io.on('connection', function(socket) {
    console.log('a user conected')
})

http.listen(port, function() {
    console.log('listening on' + port)
})
