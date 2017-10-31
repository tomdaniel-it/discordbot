var genericfunctions = require('../../GenericFunctions.js');

module.exports = {
    execute: function(command){
        if(command.getMessage().channel.type!=="text"){
            genericfunctions.sendMessage(command, "This is only possible in a text channel.");
            return;
        }
        var message = command.getMessage();
        var params = command.getParameters();
        if(params.length===0){
            //DELETE ALL MESSAGES OF CHANNEL
            message.channel.fetchMessages().then(messages => message.channel.bulkDelete(messages));
            return;
        }
        if(params.length===1&&params[0].key==="amount"){
            //DELETE X MESSAGES OF CHANNEL
            var messagecount = Math.floor(Number(params[0].value))+1;
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
        if(params.length===1&&params[0].key==="user"){
            //MAKE IT ONLY DELETE COMMENTS OF SPECIFIC USER
            message.channel.fetchMessages().then(messages=>{
                messages = messages.array();
                var messagesToDelete = [];
                for(var i=0;i<messages.length;i++){
                    if(messages[i].author.username.toLowerCase()===params[0].value.toLowerCase() || (params[0].value.length>3 && messages[i].author.id===params[0].value.substring(2, params[0].value.length-1))){
                        messagesToDelete.push(messages[i]);
                    }
                }
                if(messagesToDelete.length!==0)
                    message.channel.bulkDelete(messagesToDelete);
            });
            return;
        }

        //DELETE MESSAGES WITH LIMIT AND ONLY FROM SPECIFIC USER TODO
        var user;
        var messagecount;
        if(params[0].key==="user"){
            user = params[0].value;
            messagecount = params[1].value;
        }else{
            messagecount = params[0].value;
            user = params[1].value;
        }

        messagecount = Math.floor(Number(messagecount))+1;
        
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
            var counter = 0;
            for(var i=0;i<messages.length;i++){
                if(messages[i].author.username.toLowerCase()===user.toLowerCase() || (user.length>3 && messages[i].author.id===user.substring(2, user.length-1))){
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