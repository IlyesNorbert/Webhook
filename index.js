'use strict';
var pubnub = require("pubnub")({
    ssl           : true,  // <- enable TLS Tunneling over TCP 
    publish_key   : "pub-c-....bd09a3eff137",
    subscribe_key : "sub-c-.....02ee2ddab7fe"
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
                    channel   : 'my_channel',
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
