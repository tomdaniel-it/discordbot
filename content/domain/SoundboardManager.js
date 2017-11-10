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

function isStandaloneSound(sound){
    var em = new emitter();
    setTimeout(function(){
        if(sound === undefined || sound === null || sound === ""){
            em.emit('ready', false);
            return;
        }
        if(sound.slice(-1) === "/") sound = sound.substring(0, sound.length-1);
        module.exports.getAll().on('ready', list=>{
            for(var i=0;i<list.length;i++){
                if(list[i].slice(-1) === "/") continue;
                if(list[i].toLowerCase() === sound.trim().toLowerCase()){
                    em.emit("ready", true);
                    return;
                }
            }
            em.emit("ready", false);
            return;
        });
    }, 1);
    return em;
}

module.exports = {
    get: function(directory){
        var em = new emitter();
        setTimeout(function(){
            if(directory === undefined) directory = null;
            if(directory !== null){
                directory = directory.trim();
                if(directory === ""){
                    directory = null;
                }
            }
            isStandaloneSound(directory).on("ready", result=>{
                if(result){
                    em.emit("ready", [], new Error("You can only list a directory or everything, not a single sound."));
                    return;
                }
                if(directory !== null && directory.indexOf("/") !== -1 && directory.slice(-1) !== "/"){
                    em.emit("ready", [], new Error("You can only list a directory or everything, not a single sound."));
                    return;
                }
                var newoptions = JSON.parse(JSON.stringify(options));
                if(directory !== null){
                    newoptions.path = newoptions.path.replace("{sound}", directory);
                }else{
                    newoptions.path = newoptions.path.replace("{sound}", "");
                }
                getJSON(newoptions, (statusCode, result)=>{
                    if(result.length===0){
                        em.emit("ready", [], new Error("That is an unknown directory."));
                        return;
                    }
                    var newlist = [];
                    for(var i=0;i<result.length;i++){
                        if(directory !== null){
                            newlist.push(result[i].urlSnip);
                        }else{
                            var regex = /.*\/.*/;  //test/test
                            if(regex.test(result[i].urlSnip)){
                                //item is in directory
                                var item = result[i].urlSnip.split("/")[0]+"/";
                                if(newlist.indexOf(item) === -1){
                                    newlist.push(item);
                                }
                            }else{
                                //item is NOT in directory
                                newlist.push(result[i].urlSnip);
                            }
                        }
                    }
                    var directoryList = [];
                    var itemList = [];
                    for(var i=0;i<newlist.length;i++){
                        if(newlist[i].slice(-1) === "/"){
                            directoryList.push(newlist[i]);
                        }else{
                            itemList.push(newlist[i]);
                        }
                    }
                    directoryList = directoryList.sort();
                    itemList = itemList.sort();
                    newlist = directoryList.concat(itemList);
                    em.emit("ready", newlist);
                });
            });
        }, 1);
        return em;
    },
    getAll: function(){
        var em = new emitter();
        setTimeout(function(){
            var newoptions = JSON.parse(JSON.stringify(options));
            newoptions.path = newoptions.path.replace("{sound}", "");
            getJSON(newoptions, (statusCode, result)=>{
                var newlist = [];
                for(var i=0;i<result.length;i++){
                    newlist.push(result[i].urlSnip);
                }
                em.emit("ready", newlist);
            });
        }, 1);
        return em;
    },
    play: function(sound){
        var em = new emitter();
        setTimeout(function(){
            if(sound === undefined || sound === null || sound.trim() === ""){
                em.emit("ready", [], new Error("Enter a sound to play."));
                return;
            }
            var newoptions = JSON.parse(JSON.stringify(options));
            newoptions.path = newoptions.path.replace("{sound}", sound);
            getJSON(newoptions, (statusCode, result)=>{
                if(result.length === 0){
                    em.emit("ready", [], new Error("That is an unknown sound."));
                    return;
                }
                em.emit("ready", result);
            });
        }, 1);
        return em;
    }
};