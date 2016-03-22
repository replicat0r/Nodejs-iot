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
var ejs = require('ejs');
var brightnessVal




var options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('cert.pem'),

}

tls.createServer(options, function(s) {
    console.log('TLS connection established ')
    s.addListener('data', function(data) {
        var timerId, composedData, key
        incomingData = data
        clearInterval(timerId);

        console.log('=== received ok==')
        var parsedData = JSON.parse(data)

        console.log(data)
        // for (key in data) {
        //     if (data.hasOwnProperty(key)) {
        //         console.log(`key is ${key} , data is ${data[key]}`)
        //         composedData = '{"' + key + '"' + ":" + data[key] + "}";
        //     }
        // }
        console.log("composed Data:" + parsedData)

        Settings.findOne({}, function(err, result) {
            if (err) {
                console.log(err)
            }
            if (!result) {
                var newSetting = new Settings({ brightness: parsedData.brightness })
                newSetting.save(function(err) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('data saved')
                    }
                })

            } else {
                Settings.update({}, {
                    brightness: parsedData.brightness

                }, function(err) {
                    //handle it
                })

            }


        })

        console.log(`newsetting data: ${newSetting.brightness}`)



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





}).listen(TLS_PORT)


app.set('view engine', 'ejs');
app.get('/', function(req, res) {
    Settings.findOne({}, function(err, result) {
        if (err) {
            console.log(err)
        }
        brightnessVal = result.brightness
        console.log(`brightness is ${brightnessVal}`)
        res.render('index', { val: brightnessVal });

    })

});

io.on('connection', function(socket) {
    socket.on('updateBright', function(updatedValue) {
        console.log('new updated value is: ' + updatedValue);

        Settings.update({}, {
            brightness: updatedValue

        }, function(err) {
            //handle it
        })
    });

})

http.listen(port, function() {
    console.log('listening on' + port)
})
