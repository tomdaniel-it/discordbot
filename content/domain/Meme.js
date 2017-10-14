module.exports = {
    execute: function(command){
        var fs = require('fs');
        var filenames = fs.readdirSync('content/storage/memes');
        var filename = filenames[Math.floor(Math.random()*filenames.length)];
        command.getMessage().channel.send("", {file:"content/storage/memes/"+filename});

    }
};