'use strict';
var pubnub = require("pubnub")({
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

restService.post('/echo', function(req, res) {
    var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.room ? req.body.result.parameters.room : "Seems like some problem. Speak again."
    pubnub.publish({ 
                    channel   : 'alma',
                    message   : initiateMessage,
                    callback  : function(e) { 
                        console.log( "SUCCESS!", e ); 
                        	return res.json({
								speech: "turn on the " + speech + "lamp",
								displayText: "turn on the " + speech + "lamp",
								source: 'webhook-echo-sample'
							});
                        },
                    error     : function(e) { 
                        response.tellWithCard("Could not connect", "Drone", "Could not connect");
                        console.log( "FAILED! RETRY PUBLISH!", e ); }
                });    
});


restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
