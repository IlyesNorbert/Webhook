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
		var room = req.body.result && req.body.result.parameters && req.body.result.parameters.Room ? req.body.result.parameters.Room : "Seems like some problem. Room."
		var onOff = req.body.result && req.body.result.parameters && req.body.result.parameters.OnOff ? req.body.result.parameters.OnOff : "Seems like some problem. OnOff."
		
		pubnubfunc(room, onOff);
		return res.json({
			speech: "The " + room + "  lamp is turned " + onOff + "		sessionId: " + req.body.sessionId,
			displayText: "The " + room + " lamp is turned " + onOff + "		sessionId: " + req.body.sessionId,
			source: 'webhook-echo-sample'
		});
	}
	else
	{
		sessionId = req.body.sessionId;
		init = true;
		var init = req.body.result.init;
		return res.json({
			speech: "Home initialized : sessionId: " + sessionId + " init :" + init,
			displayText: "Home initialized : sessionId: " + sessionId + " init :" + init,
			source: 'webhook-echo-sample'
		});
	}
});  

var  pubnubfunc = function(room, onOff)
{
	process.stdout.write("hello: " + onOff);
	var command
	if (onOff === "on")
	{
		command = "turnOntheSpecificLamp";
	}
	else
	{
		command = "turnOfftheSpecificLamp";
	}
	var initiateMessage = { "command" : command,  "room" : room , "valueonoff" : onOff};
	pubnub.publish({ 
                    channel   : 'alma',
                    message   : initiateMessage,
                    callback  : function(e) { 
                        console.log( "SUCCESS!", e );
						success	= true;
					},
                    error     : function(e) {
						success = false;
                        response.tellWithCard("Could not connect", "Drone", "Could not connect");
                        console.log( "FAILED! RETRY PUBLISH!", e ); 
						}
                });  
}
restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
