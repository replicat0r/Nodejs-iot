var tls = require('tls')
var fs = require('fs')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 5000
var TLS_PORT = 2000
var incomingData
var mongoose = require('mongoose');
var url = 'mongodb://test:test@ds021689.mlab.com:21689/simple_iot'
mongoose.connect(url)
var settingSchema = mongoose.Schema({
    brightness: String
})
var Settings = mongoose.model('Setting', settingSchema)



var options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('cert.pem'),

}

tls.createServer(options, function(s) {
    console.log('TLS connection established ')
    s.addListener('data', function(data) {
        var timerId,composedData
        incomingData = data
        clearInterval(timerId);

        console.log('=== received ok==')
        //var parsedData = JSON.parse(data)


        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                composedData = '{"' + key + '"' + ":" + data[key] + "}";
            }
        }
        console.log("composed Data:" + composedData)
        var newSetting = new Settings({ brightness: composedData.brightness })
        console.log(`newsetting data: ${newSetting.brightness}`)

        newSetting.save(function(err) {
            if (err) {
                console.log(err)
            } else {
                console.log('data saved')
            }
        })

        s.write('Ok')

        timerId = setInterval(function() {
            s.write(data)
        }, 3000);





    })

    console.log("TLS Client authorized:", s.authorized);
    if (!s.authorized) {
        console.log("TLS authorization error:", s.authorizationError);
    }

    console.log("Cipher: ", s.getCipher());
    console.log("Address: ", s.address());
    console.log("Remote address: ", s.remoteAddress);
    console.log("Remote port: ", s.remotePort);




    s.on("error", function(err) {
        console.log("Error:", err.toString());
    });

    s.on("end", function() {
        clearInterval(timerId);
        console.log("End: Connection Terminated");
    });

    s.on("close", function() {
        clearInterval(timerId);
        console.log("Close Connection Closed:");
    });

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
