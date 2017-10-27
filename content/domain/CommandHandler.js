module.exports = class CommandHandler{
    constructor(command){
        this.command = command;
    }

    run(){
        var command_dir = "../domain/commands/";
        switch(this.command.getCommand()){
            case "ping":
                var ping_command = require(command_dir + 'Ping.js');
                ping_command.execute(this.command);
                break;
            case "help":
                var help_command = require(command_dir + 'Help.js');
                help_command.execute(this.command);
                break;
            case "insult":
                var insult_command = require(command_dir + 'Insult.js');
                insult_command.execute(this.command);
                break;
            case "meme":
                var meme_command = require(command_dir + 'Meme.js');
                meme_command.execute(this.command);
                break;
            case "fancy":
                var fancy_command = require(command_dir + 'Fancy.js');
                fancy_command.execute(this.command);
                break;
            case "purge":
                var purge_command = require(command_dir + 'Purge.js');
                purge_command.execute(this.command);
                break;
            case "say":
                var say_command = require(command_dir + 'Say.js');
                say_command.execute(this.command);
                break;
            case "music_play":
                var music_play_command = require(command_dir + 'MusicPlay.js');
                music_play_command.execute(this.command);
                break;
            case "coinflip":
                var coinflip_command = require(command_dir + 'Coinflip.js');
                coinflip_command.execute(this.command);
                break;
            default:
                return;
        }
    }
};