var http = require("http");
var https = require("https");
var emitter = require('events').EventEmitter;

function getJSON(options, onResult)
{

    var port = options.port == 443 ? https : http;
    var req = port.request(options, function(res)
    {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
        console.log(err);
    });

    req.end();
};

var optionsSearch = {
    host: 'www.googleapis.com',
    port: 443,
    path: '/youtube/v3/search?maxResults=5&part=snippet&q={question}&type=&order=relevance&key=' + require('../../keys.js').youtube_api_key,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

module.exports = {
    get: function(directory){
        if(directory === undefined) directory = null;

    },
    play: function(sound){

    }
};