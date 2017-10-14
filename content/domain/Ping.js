module.exports = {
    execute: function(command){
        command.getMessage().channel.send("Pong");
    }
};