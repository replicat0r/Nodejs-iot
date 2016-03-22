var tls = require('tls')
var fs = require ('fs')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 5000
var TLS_PORT = process.env.PORT || 2000



var options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('cert.pem'),

}


tls.createServer(options, function(socket){
  console.log('TLS connection established')
  socket.addListener('data',function(data){
      console.log(data)
  })
  socket.write('Listening On Port 2000')
  socket.pipe(socket)
}).listen(TLS_PORT)



app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection',function(socket){
  console.log('a user conected')
})

http.listen(port,function(){
    console.log('listening on' + port)
})
