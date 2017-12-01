var apiai = require('apiai');
var emitter = require('events').EventEmitter;
var http = require("http");
var https = require("https");

var app = apiai(require('../../keys.js').apiai_access_token);

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
        if(err instanceof Error){
            throw err;
        }else{
            throw new Error(err);
        }
    });

    req.end();
};

var optionsCleverbot = {
    host: 'www.cleverbot.com',
    port: 443,
    path: '/getreply?key=' + require('../../keys.js').cleverbot_access_token + '&input={message}',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

function sendAPIAI(message, uniqueid){
    uniqueid = uniqueid.toString();
    var em = new emitter();
    var request = app.textRequest(message, {
       sessionId: uniqueid
    });
    request.on('response', function(response) {
       em.emit('ready', response);
    });
    request.on('error', function(error) {
        em.emit('ready', null, error);
    });
    
    request.end();
    return em;
}

function sendCleverBot(message){ //MAX 5000 CALLS SO DON'T SPAM AND ONLY USE WHEN NEEDED (WHEN APIAI DOESN'T HAVE AN ANSWER)
    var em = new emitter();
    var options = JSON.parse(JSON.stringify(optionsCleverbot));
    options.path = options.path.replace("{message}", encodeURI(message));
    getJSON(options, function(statusCode, result){
        if(statusCode != "200"){
            throw new Error("Something went wrong contacting CleverBot, statuscode not 200, result: " + result);
        }
        try{
            em.emit('ready', result.output);
            return;
        }catch(err){
            throw new Error("Something went wrong contacting CleverBot (can't read output), statuscode is 200 but result is: " + result);
        }
    });
    return em;
}




module.exports = {
    sendMessage: function(message){
        sendAPIAI(message.content, message.author.id).on('ready', (result, error)=>{
            try{
                if(error){
                    if(error instanceof Error){
                        throw error;
                    }else{
                        throw new Error(error);
                    }
                }
                var answer = result.result.fulfillment.speech;
                if(result.result.action === "input.unknown"){
                    //SEND MESSAGE TO THIRD PARTY (CLEVERBOT)
                    sendCleverBot(message.content).on('ready', (answer)=>{
                        message.author.send(answer);
                    });
                    return;
                }
                message.author.send(answer);
            }catch(err){
                if(err.message.indexOf("CleverBot")!==-1){
                    throw err;
                }
                if(result.result.action === "input.unknown"){
                    //SEND MESSAGE TO THIRD PARTY (CLEVERBOT)
                    sendCleverBot(message.content).on('ready', (answer)=>{
                        message.author.send(answer);
                    });
                    return;
                }
            }
        });
    }
};