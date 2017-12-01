var genericfunctions = require('../../GenericFunctions.js');

module.exports = {
    execute: function(command){
        var fs = require('fs');
        var filenames = fs.readdirSync(require('../../../../settings.js').memes_directory);
        if(filenames.length===0){
            //NO IMAGES IN DIRECTORY
            genericfunctions.sendMessage(command, "Error: content/storage/memes/ does not contain any meme images.");
            return;
        }else if(filenames.length===1 && filenames[0]==="meme.jpg-example"){
            //NO IMAGES IN DIRECTORY EXCEPT EXAMPLE
            genericfunctions.sendMessage(command, "Error: content/storage/memes/ does not contain any meme images.");
            return;
        }
        var filename = "meme.jpg-example";
        while(filename==="meme.jpg-example"){
            filename = filenames[Math.floor(Math.random()*filenames.length)];
        }
        command.getMessage().channel.send("", {file:require('../../../../settings.js').memes_directory+filename});
    }
};