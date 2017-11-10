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

var options = {
    host: 'm.isw',
    port: 80,
    path: '/api/sb/{sound}',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

module.exports = {
    get: function(directory){
        var em = new emitter();
        setTimeout(function(){
            if(directory === undefined) directory = null;
            var newoptions = JSON.parse(JSON.stringify(options));
            if(directory !== null){
                newoptions.path = newoptions.path.replace("{sound}", directory);
            }else{
                newoptions.path = newoptions.path.replace("{sound}", "");
            }
            getJSON(newoptions, (statusCode, result)=>{
                em.emit("ready", result);
            });
        }, 1);
        return em;
    },
    play: function(sound){
        var em = new emitter();
        setTimeout(function(){
            var newoptions = JSON.parse(JSON.stringify(options));
            newoptions.path = newoptions.path.replace("{sound}", sound);
            getJSON(newoptions, (statusCode, result)=>{
                em.emit("ready", result);
            });
        }, 1);
        return em;
    }
};