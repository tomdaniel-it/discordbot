module.exports = {
  execute: function(command){
      var fs = require('fs');
      var filenames = fs.readdirSync("content/storage/triggered_memes/");
      if(filenames.length===0){
          //NO IMAGES IN DIRECTORY
          genericfunctions.sendMessage(command, "Error: content/storage/triggered_memes/ does not contain any meme images.");
          return;
      }
      filename = filenames[Math.floor(Math.random()*filenames.length)];
      command.getMessage().channel.send("", {file:"content/storage/triggered_memes/"+filename});
      command.getMessage().delete();
  }
};