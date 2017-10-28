var genericfunctions = require('../GenericFunctions.js');

module.exports = {
    execute: function(command){
        genericfunctions.sendMessage(command, "Pong");
    }
};