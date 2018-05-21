var genericfunctions = require('../../GenericFunctions.js');
var settings = require('../../../../settings.js');
var challengeManager = require('./Challenge.js');

module.exports = {
    execute: function(command) {
        var params = command.getParameters();
        var guild = command.getMessage().guild;

        if (guild !== undefined && guild !== null) {
            genericfunctions.sendErrorMessage(command, "This command is only available in DM's with the bot.");
            return;
        }

        challengeManager.registerChoice(command, params);
        return;
    },
};