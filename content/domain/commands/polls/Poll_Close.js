var pollmanager = require('../../PollManager.js');
var genericfunctions = require('../../GenericFunctions.js');

module.exports = {
    execute: function(command){
        var guild = command.getMessage().guild;
        var serverid = null;
        var userid = command.getMessage().author.id;

        if(guild === undefined || guild === null){
            genericfunctions.sendErrorMessage(command, "This command is only available in a discord server.");
            return;
        }
        var serverid = guild.id;
        if(guild.id === undefined || guild.id === null || guild.id.length === 0){
            genericfunctions.sendErrorMessage(command, "This command is only available in a discord server.");
            return;
        }

        var name = command.getParameters()[0].value;
        var poll = pollmanager.get(serverid, name);
        var maxVotes = 0;
        var optionsWithMaxVotes = [];

        if(poll === undefined || poll === null){
            genericfunctions.sendErrorMessage(command, "There is no poll with that name.");
            return;
        }

        while(true){
            if(poll.options === undefined || poll.options === null || poll.options.length === 0) break;
            //DEFINE maxVotes
            for(var i=0;i<poll.options.length;i++){
                if(poll.options[i].votes === undefined || poll.options[i].votes === null) continue;
                if(poll.options[i].votes.length > maxVotes)
                    maxVotes = poll.options[i].votes.length;
            }
            if(maxVotes === 0) break;
            for(var i=0;i<poll.options.length;i++){
                if(poll.options[i].votes === undefined || poll.options[i].votes === null) continue;
                if(poll.options[i].votes.length === maxVotes)
                    optionsWithMaxVotes.push(poll.options[i].name);
            }
            var content;
            if(optionsWithMaxVotes.length === 1){
                content = "Poll " + poll.name + " has been closed: \n```- " + optionsWithMaxVotes[0] + "```\n" + "This option got the most votes (" + maxVotes + ").";
            }else{
                content = "Poll " + poll.name + " has been closed: \n```";
                for(var i=0;i<optionsWithMaxVotes.length;i++){
                    content += "\n- " + optionsWithMaxVotes[i];
                }
                content += "\n```\n";
                content += "These options all got the most votes (" + maxVotes + ").";
            }
            try{
                pollmanager.remove(serverid, name);
            }catch(err){
                genericfunctions.sendErrorMessage(command, err.message);
                return;
            }
            genericfunctions.sendMessage(command, content).then(message=>{
                genericfunctions.deleteMessage(command.getMessage());
            });
            return;
        }

        try{
            pollmanager.remove(serverid, name);
        }catch(err){
            genericfunctions.sendErrorMessage(command, err.message);
            return;
        }
        genericfunctions.sendMessage(command, "The poll " + poll.name + " closed with 0 votes.").then(message=>{
            genericfunctions.deleteMessage(command.getMessage());
        });

        //NO VOTES WERE MADE


        return;
    }
};