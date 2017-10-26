module.exports = {
    execute: function(command){
        var fs = require('fs');
        var insults  = fs.readFileSync("content/storage/insults.txt").toString().split("\n");
        var insult = insults[Math.floor(Math.random()*insults.length)];
        var params = command.getParameters();
        if(params.length==0){
            //SEND INSULT
            command.getMessage().channel.send(insult);
        }else{
            //SEND INSULT WITH PERSON (KEY p)
            command.getMessage().channel.send(params[0].value + ", " + insult);
        }
    }
};