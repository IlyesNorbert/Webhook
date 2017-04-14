'use strict';
/* var pubnub = require("pubnub")({
    ssl           : true,  // <- enable TLS Tunneling over TCP 
    publish_key   : "pub-c-b1159858-e2a5-4fda-81ba-18e5a3c7a9ed",
    subscribe_key : "sub-c-bca32ba0-200c-11e7-bb8a-0619f8945a4f"
}); */


const express = require('express');
const bodyParser = require('body-parser');

const restService = express();

restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

restService.post('/echo', function(req, res) {
    var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.room ? req.body.result.parameters.room : "Seems like some problem. Speak again."
    return res.json({
        speech: speech,
        displayText: speech,
        source: 'webhook-echo-sample'
    });
});  


restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
