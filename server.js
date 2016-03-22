var tls = require('tls')
var fs = require ('fs')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var  msg = [
            ".-..-..-.  .-.   .-. .--. .---. .-.   .---. .-.",
            ": :; :: :  : :.-.: :: ,. :: .; :: :   : .  :: :",
            ":    :: :  : :: :: :: :: ::   .': :   : :: :: :",
            ": :: :: :  : `' `' ;: :; :: :.`.: :__ : :; ::_;",
            ":_;:_;:_;   `.,`.,' `.__.':_;:_;:___.':___.':_;" 
          ].join("\n")
          
var options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('cert.pem'),

}

tls.createServer(options, function(socket){
  console.log('TLS connection established')
  //socket.write(msg)
  socket.addListener('data',function(data){
      console.log(data)
  })
  socket.pipe(socket)  
}).listen(8000)

io.on('connection',function(socket){
  console.log('a user conected') 
})

http.listen(3000,function(){
    console.log('listening on 3000')
})