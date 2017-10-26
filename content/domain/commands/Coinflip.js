module.exports = {
    execute: function(command){
        var heads = Math.round(Math.random());
        command.getMessage().channel.send(command.getMessage().author.username + " flipped " + (heads?"HEADS":"TAILS") + "!");
    }
};