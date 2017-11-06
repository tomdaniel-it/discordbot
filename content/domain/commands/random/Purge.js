var genericfunctions = require('../../GenericFunctions.js');

module.exports = {
    execute: function(command){
        if(command.getMessage().channel.type!=="text"){
            genericfunctions.sendMessage(command, "This is only possible in a text channel.");
            return;
        }
        var message = command.getMessage();
        var params = command.getParameters();
        var amount = null;
        var user = null;
        if(params.length !== 0){
            if(params.split(" ").length > 0 && !isNaN(params.split(" ")[0])){
                //FIRST ARG = AMOUNT
                amount = Number(params.split(" ")[0])+1;
                if(params.split(" ").length > 1){
                    user = params.substring(params.split(" ")[0].length+1);
                }
            }else if(params.split(" ").length > 0 && !isNaN(params.split(" ")[params.split(" ").length-1])){
                //LAST ARG = AMOUNT
                amount = Number(params.split(" ")[params.split(" ").length-1])+1;
                user = params.substring(0, params.length - params.split(" ")[params.split(" ").length-1].length-1);
            }else{
                //AMOUNT ISN'T STATED
                user = params;
            }
        }

        if(amount === null && user === null){
            //DELETE ALL MESSAGES OF CHANNEL
            message.channel.fetchMessages().then(messages => message.channel.bulkDelete(messages));
            return;
        }
        if(user === null && amount !== null){
            //DELETE X MESSAGES OF CHANNEL
            var messagecount = amount;
            if(isNaN(messagecount)){
                genericfunctions.sendErrorMessage(command, "Purge amount requires a number of messages to delete.");
                return;
            }
            if(messagecount>100){
                genericfunctions.sendErrorMessage(command, "Purge amount has a max. of 99 messages.");
                return;
            }else if(messagecount < 2){
                genericfunctions.sendErrorMessage(command, "Purge amount has a min. of 1 message.");
                return;
            }
            message.channel.fetchMessages({limit: messagecount}).then(messages => {
                if(messages.array().length===1){
                    messages.array()[0].delete();
                }
                else if(messages.array().length>1){
                    message.channel.bulkDelete(messages)
                }
            });
            return;
        }
        if(amount === null && user !== null){
            //MAKE IT ONLY DELETE COMMENTS OF SPECIFIC USER
            message.channel.fetchMessages().then(messages=>{
                messages = messages.array();
                var messagesToDelete = [];
                var userid = genericfunctions.getUserId(command, command.getMessage().guild, user);
                if(userid === undefined || userid === null) return;
                for(var i=0;i<messages.length;i++){
                    if(messages[i].author.id===userid){
                        messagesToDelete.push(messages[i]);
                    }
                }
                if(messagesToDelete.length!==0)
                    message.channel.bulkDelete(messagesToDelete);
            });
            return;
        }

        //DELETE MESSAGES WITH LIMIT AND ONLY FROM SPECIFIC USER TODO
        messagecount = amount;
        
        if(isNaN(messagecount)){
            genericfunctions.sendErrorMessage(command, "Purge amount requires a number of messages to delete.");
            return;
        }
        if(messagecount>100){
            genericfunctions.sendErrorMessage(command, "Purge amount has a max. of 99 messages.");
            return;
        }else if(messagecount < 2){
            genericfunctions.sendErrorMessage(command, "Purge amount has a min. of 1 message.");
            return;
        }

        message.channel.fetchMessages().then(messages=>{
            messages = messages.array();
            var messagesToDelete = [];
            var userid = genericfunctions.getUserId(command, command.getMessage().guild, user);
            if(userid === undefined || userid === null) return;
            var counter = 0;
            for(var i=0;i<messages.length;i++){
                if(messages[i].author.id===userid){
                    messagesToDelete.push(messages[i]);
                    counter++;
                    if(counter == messagecount) break;
                }
            }
            if(messagesToDelete.length>1){
                message.channel.bulkDelete(messagesToDelete);
            }
            else if(messagesToDelete.length===1){
                if(messagesToDelete[0]!==message){
                    if(message.deletable) message.delete();
                }
                messagesToDelete[0].delete();
            }
        });
        return;

    }
};