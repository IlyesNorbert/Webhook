'use strict';
var pubnub = require("pubnub");

pubnub = new pubnub({
    ssl           : true,  // <- enable TLS Tunneling over TCP 
    publish_key   : "pub-c-b1159858-e2a5-4fda-81ba-18e5a3c7a9ed",
    subscribe_key : "sub-c-bca32ba0-200c-11e7-bb8a-0619f8945a4f"
});


const express = require('express');
const bodyParser = require('body-parser');

const restService = express();

restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

var sessionId = undefined;
var init = false;

restService.post('/echo', function(req, res) {
    if (sessionId != undefined)
	{
		//var room = req.body.result && req.body.result.parameters && req.body.result.parameters.room.original ? req.body.result.parameters.room.original : "Seems like some problem. Room."
		//var device = req.body.result && req.body.result.parameters && req.body.result.parameters.device.original ? req.body.result.parameters.device.original : "Seems like some problem. OnOff."
		if (req.body.result.action === "smarthome.device.switch.off"){
			return res.json({
				speech: "turned off.",
				displayText: "Turned off.",
				source: 'Viki-Smart-Home'
			});
		}
	}
	else
	{
		sessionId = req.body.sessionId;
		init = true;
		var init = req.body.result.init;
		return res.json({
			speech: "Home initialized.",
			displayText: "Home initialized.",
			source: 'Viki-Smart-Home'
		});
	}
});  

restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
