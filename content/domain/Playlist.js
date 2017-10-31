var emitter = require('events').EventEmitter;
var queues = []; //[{connection: Connection, dispatcher: StreamDispatcher, serverid:String, emitter: EventEmitter, playing:boolean, currentlyPlaying: {url:String, type:String, title:String, duration:String}, playlist:[{url:String, type:String, title:String, duration:String}] }]
var musicplayer = require('../domain/MusicPlayer.js');

function getQueue(serverid){
    serverid = serverid.toString();
    var queue = null;
    for(var i=0;i<queues.length;i++){
        if(queues[i].serverid === serverid){
            queue = queues[i];
            break;
        }
    }
    if(queue===null){
        return createQueue(serverid);
    }
    return queue;
}

function createQueue(serverid){
    var queue = {
        connection: null,
        dispatcher: null,
        serverid: serverid,
        emitter: null,
        playing: false,
        currentlyPlaying: null,
        playlist: []
    };
    queues.push(queue);
    return queues[queues.length-1];
}

function getNextSong(queue){
    //GETS NEXT SONG IN PLAYLIST AND REMOVES IT FROM PLAYLIST
    if(queue===null || queue.playlist === undefined) return null;
    var playlist = queue.playlist;
    if(playlist===null||playlist.length===0) return null;
    var song = playlist.shift(); 
    queue.currentlyPlaying = song;
    return song; //RETURN {url:String, type:String, title:String, duration:String}
}

function addSong(playlist, song){
    //ADDS SONG TO PLAYLIST
    if(playlist===null||playlist.length===0){
        playlist = [song];
        return;
    }
    playlist.push(song);
    return;
}

function createSong(url, type, title, duration){
    return {
        url: url,
        type: type,
        title: title,
        duration: duration
    };
}

function createConnection(channel){
    var em = new emitter();
    setTimeout(function(){
        musicplayer.connect(channel).on('connected', connection=>{
            em.emit("created", connection);
        });;
    }, 1);
    return em;
}

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

function getConnection(serverid){
    serverid = serverid.toString();
    return getQueue(serverid).connection; //RETURN Connection
}

function setConnection(serverid, connection){
    serverid = serverid.toString();
    var queue = getQueue(serverid);
    queue.connection = connection;
    return;
}

function playSong(serverid, connection, song){
    var queue = getQueue(serverid);
    queue.playing = true;
    queue.emitter.emit('newsong', song);
    if(queue.dispatcher !== undefined && queue.dispatcher !== null){
        queue.dispatcher.removeAllListeners();
    }
    var dispatcher = musicplayer.play(connection, song.url, song.type);
    dispatcher.on('end', val=>{
        if(!queue.playing) return;
        var nextsong = getNextSong(queue);
        if(nextsong===null){
            queue.playing = false;
            module.exports.stop(serverid);
            return;
        }
        setTimeout(function(){ //PREVENTION FOR BUG THAT NEXT SONG DOESN'T PLAY IN CONNECTION (BUT DISPATCHER WORKS AND END EVENT IS THROWN ON DISPATCHER)
            playSong(serverid, connection, nextsong);
        }, 500);
    });
    queue.dispatcher = dispatcher;
}

module.exports = {
    getCurrentlyPlaying: function(serverid){
        serverid = serverid.toString();
        var queue = getQueue(serverid);
        if(queue.currentlyPlaying === undefined || queue.currentlyPlaying === null) return null;

        return {title: queue.currentlyPlaying.title, duration: queue.currentlyPlaying.duration}; //RETURN {title: String, duration: String}
    },
    skip: function(serverid){
        serverid = serverid.toString();
        var connection = getConnection(serverid);
        var song = getNextSong(getQueue(serverid));
        if(song===null){
            if(getQueue(serverid).playing){
                module.exports.stop(serverid);
                return true;
            }else{
                return false;
            }
        }
        if(getQueue(serverid).playing)
            playSong(serverid, connection, song);
        return true;
    }, 
    stop: function(serverid){
        serverid = serverid.toString();
        var queue = getQueue(serverid);
        queue.playing = false;
        var connection = getConnection(serverid);
        setConnection(serverid, musicplayer.stop(connection));
    }, 
    purge: function(serverid, amount){
        //AMOUNT IS OPTIONAL, IF NULL => PURGE ALL
        serverid = serverid.toString();
        var playlist = getQueue(serverid).playlist;
        if(amount === undefined || amount === null || amount >= playlist.length){
            amount = playlist.length;
        }
        if(amount < 0) return;
        for(var i=0;i<amount;i++){
            playlist.shift();
        }
        return;
    }, 
    play: function(serverid, channel){
        serverid = serverid.toString();
        var queue = getQueue(serverid);
        
        //GIVE ERROR IF PLAYLIST IS EMPTY
        if(queue.playlist===null || queue.playlist.length===0){
            throw new Error('Playlist is empty, please add some songs.');
        }

        //GIVE ERROR IF BOT IS ALREADY PLAYING
        if(queue.playing){
            throw new Error('I am already playing something.');
        }

        var em = new emitter();
        queue.emitter = em;

        setTimeout(function(){
            //PLAY
            var song = getNextSong(queue);
            var connection = getConnection(serverid);
            if(connection===null){
                connection = createConnection(channel).on("created", connection=>{
                    playSong(serverid, connection, song);
                    setConnection(serverid, connection);
                    return;
                });
            }else{
                playSong(serverid, connection, song);
                return;
            }
        }, 1);
        return em; //HAS .on('newsong', song=>{}) EVENT
    }, 
    add: function(serverid, song, position){
        //POSITION IS OPTIONAL, IF NULL => ADD TO BOTTOM OF QUEUE
        //SONG => {url:String, type:String, title:String, duration:String} types: 'yt'
        serverid = serverid.toString();
        var playlist = module.exports.getPlaylist(serverid);
        if(position===undefined || position===null || position<=0 || position>playlist.length){
            playlist.push(song);
            return;
        }
        playlist.splice(position-1, 0, song);
        return;
    }, 
    getPlaylist: function(serverid){
        serverid = serverid.toString();
        var playlist = getQueue(serverid).playlist;
        playlist = (playlist===null?[]:playlist);
        return playlist; //RETURN [{title: String, duration: String}]
    },
    isPlaying: function(serverid){
        serverid = serverid.toString();
        return getQueue(serverid).playing;
    }
};