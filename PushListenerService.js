var express = require('express');
var googlehome = require('./google-home-notifier');
var ngrok = require('ngrok');
var bodyParser = require('body-parser');
var app = express();
const serverPort = 7070;

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/google-home-notifier', urlencodedParser, function (req, res) {

	var deviceName = 'Google Home';
	googlehome.device(deviceName);	
	googlehome.accent('uk'); 

  	if (!req.body) return res.sendStatus(400)
  		console.log(req.body);
  
	var text = req.body.text;
 
        var fields = text.split(/;/);
        var portNo = fields[0];
	var textToSay = fields[1];      

	googlehome.ip(portNo);

	// 192.168.1.16 = Google Home (main)
	// 192.168.1.12 = Google Home Mini (bathroom speaker)
	// 192.168.1.28 = Google Home Mini (bedroom speaker)

	 if (text){    
		try {
      			googlehome.notify(textToSay, function(notifyRes) {
        		console.log(notifyRes);
        		res.send(deviceName + ' will say: ' + textToSay + '\n');
      	});
    	} catch(err) {
      		console.log(err);
      		res.sendStatus(500);
      		res.send(err);   
	}
  	} else {
    		res.send('Please POST "text=Hello Google Home"');
  	}
})

app.listen(serverPort, function () {
  ngrok.connect(serverPort, function (err, url) {
    console.log('POST "text=Hello Google Home" to:');
    console.log('    http://localhost:' + serverPort + '/google-home-notifier');
    console.log('    ' + url + '/google-home-notifier');
    console.log('example:');
    console.log('curl -X POST -d "text=Hello Google Home" ' + url + '/google-home-notifier');
  });
})
