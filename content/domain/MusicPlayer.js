var emitter = require('events').EventEmitter;
const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1 };

module.exports = {
    
    play: function(connection, url, type){
        switch(type){
            case 'yt':
                const stream = ytdl(url, { filter : 'audioonly' });
                const dispatcher = connection.playStream(stream, streamOptions);
                return dispatcher;
            default:
                break;
        }
        return;
    },
    stop: function(connection){
        if(connection===null) return null;
        connection.disconnect();
        connection = null;
        return connection;
    },
    connect: function(channel){
        var em = new emitter();
        setTimeout(function(){
            channel.join().then(connection=>{
                em.emit("connected", connection);
            });
        }, 1);
        return em;
    }
};