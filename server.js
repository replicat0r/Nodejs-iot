var tls = require('tls')
var fs = require ('fs')
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


tls.createServer(options, function(socket){
  console.log('TLS connection established ')
  socket.addListener('data',function(data){
      //console.log(data)
      incomingData = data
      console.log('Data Received Ok!')
  })
  socket.write('Listening On Port ' + TLS_PORT)
  socket.write('You are listening on port '+ TLS_PORT + " Tom!")
  //socket.pipe(socket)
  
  
  
  
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
