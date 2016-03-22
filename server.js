var tls = require('tls')
var fs = require ('fs')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 5000



var options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('cert.pem'),

}

tls.createServer(options, function(socket){
  console.log('TLS connection established')
  socket.addListener('data',function(data){
      console.log(data)
  })
  socket.pipe(socket)  
}).listen(2000)

io.on('connection',function(socket){
  console.log('a user conected') 
})

http.listen(port,function(){
    console.log('listening on 3000')
})