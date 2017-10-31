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

function isoToString(iso){
    var regex = /((\d+)H)?((\d+)M)?(\d+)S/;
    if(!regex.test(iso)){
        return "Time undefined";
    }
    var result = "";
    var match = regex.exec(iso);
    if(match[2]!==undefined && match[2]!==null && match[2]!==''){
        if(match[2].length === 1) result += "0";
        result += match[2] + ":";
    }
    if(match[4]!==undefined && match[4]!==null && match[4]!==''){
        if(match[4].length === 1) result += "0";
        result += match[4];
    }else{
        result += "00";
    }
    result += ":";
    if(match[5].length === 1) result += "0";
    result += match[5];
    return result;
}

var optionsSearch = {
    host: 'www.googleapis.com',
    port: 443,
    path: '/youtube/v3/search?maxResults=5&part=snippet&q={question}&type=&order=relevance&key=' + require('../../keys.js').youtube_api_key,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

var optionsInfo = {
    host: 'www.googleapis.com',
    port: 443,
    path: '/youtube/v3/videos?id={id}&part=contentDetails,snippet&key=' + require('../../keys.js').youtube_api_key,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

module.exports = {
    getSearchResults: function(input){
        var em = new emitter();
        var customoptions = JSON.parse(JSON.stringify(optionsSearch));
        customoptions.path = customoptions.path.replace('{question}', encodeURI(input));
        setTimeout(function(){
            getJSON(customoptions, function(statusCode, result) {
                var ids = [];
                for(var i=0;i<result.items.length;i++){
                    ids.push(result.items[i].id.videoId);
                }
                if(ids.length===0){
                    em.emit('ready', []);
                    return;
                }

                var idstring = ids[0];
                for(var i=1;i<ids.length;i++){
                    idstring += "," + ids[i];
                }

                customoptions = JSON.parse(JSON.stringify(optionsInfo));
                customoptions.path = customoptions.path.replace('{id}', idstring);
                getJSON(customoptions, function(statusCode, result){
                    var res = [];
                    for(var i=0;i<result.items.length;i++){
                        var obj = {};
                        obj.url = "https://www.youtube.com/watch?v="+result.items[i].id;
                        obj.type = "yt";
                        obj.title = result.items[i].snippet.title;
                        obj.duration = isoToString(result.items[i].contentDetails.duration);
                        res.push(obj);
                    }
                    em.emit('ready', res);
                });
            });
        }, 1);
        return em;
    }, 
    getInfo: function(url){
        var em = new emitter();
        setTimeout(function(){
            var regex = /v=([a-zA-Z0-9]+)/;
            if(!regex.test(url)){
                em.emit('ready', null, new Error("Youtube url is incorrect."));
                return;
            }
            var match = regex.exec(url);
            module.exports.getInfoById(match[1]).on('ready', (result, err)=>{
                em.emit('ready', result, err);
            });
        }, 1);
        return em;
    },
    getInfoById: function(id){
        var em = new emitter();
        setTimeout(function(){
            var customoptions = JSON.parse(JSON.stringify(optionsInfo));
            customoptions.path = customoptions.path.replace('{id}', id);
            getJSON(customoptions, function(statusCode, result) {
                if(result.items.length === 0){
                    em.emit('ready', null, new Error("Can't find youtube video."));
                    return;
                }
                //[{connection: Connection, serverid:String, playing:boolean; playlist:[{url:String, type:String, title:String, duration:String}] }]
                var res = {};
                res.url = "https://www.youtube.com/watch?v="+id;
                res.type = 'yt';
                res.title = result.items[0].snippet.title;
                res.duration = isoToString(result.items[0].contentDetails.duration);
                em.emit('ready', res);
            });
        }, 1);
        return em;
    }
};