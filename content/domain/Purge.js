module.exports = {
    execute: function(command){
        if(command.getMessage().channel.type!=="text"){
            command.getMessage().channel.send("This is only possible in a text channel.");
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
            var messagecount = Math.floor(Number(params[0].value))+1;
            if(messagecount>100){
                require('../domain/GenericFunctions.js').sendErrorMessage(command, "Purge amount has a max. of 99 messages.");
                return;
            }
            message.channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(messages));
            return;
        }
        if(params.length===1&&params[0].key==="user"){
            //MAKE IT ONLY DELETE COMMENTS OF SPECIFIC USER, TODO
            var messagecount = Math.floor(Number(params[0].value));
            message.channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(messages));
            return;
        }
        //DELETE MESSAGES WITH LIMIT AND ONLY FROM SPECIFIC USER TODO
    }
};