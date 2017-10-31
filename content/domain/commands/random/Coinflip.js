var genericfunctions = require('../../GenericFunctions.js');

module.exports = {
    execute: function(command){
        var heads = Math.round(Math.random());
        genericfunctions.sendMessage(command, command.getMessage().author.username + " flipped " + (heads?"HEADS":"TAILS") + "!");
    }
};