module.exports = class CommandHandler{
    constructor(command){
        this.command = command;
    }

    run(){
        switch(this.command.getCommand()){
            case "ping":
                var ping_command = require('../domain/Ping.js');
                ping_command.execute(this.command);
                break;
            case "help":
                var help_command = require('../domain/Help.js');
                help_command.execute(this.command);
                break;
            case "insult":
                var insult_command = require('../domain/Insult.js');
                insult_command.execute(this.command);
                break;
            case "meme":
                var meme_command = require('../domain/Meme.js');
                meme_command.execute(this.command);
                break;
            default:
                return;
        }
    }
};