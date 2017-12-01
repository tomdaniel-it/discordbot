var genericfunctions = require("../../GenericFunctions.js");

module.exports = {
    execute: function(command){
        var guild = command.getMessage().guild;
        var channels = guild.channels.array();
        var channel;
        for(var i=0;i<channels.length;i++){
            if(channels[i].id.toString() === "233942377385951234"){ //ISW CHANNEL ID OF 'intern'
                channel = channels[i];
            }
        }
        var members = channel.members.array();
        var allowed = false;
        for(var i=0;i<members.length;i++){
            if(members[i].id === command.getMessage().author.id){
                allowed = true;
            }
        }
        if(!allowed){
            genericfunctions.sendErrorMessage(command, "You need to be member of ISW to see the wifi password.");
            return;
        }
        var pwd = require('../../../../settings.js').isw_wifi_password;
        command.getMessage().author.send("The wifi password of isw: " + pwd);
        command.getMessage().delete();
    }
};