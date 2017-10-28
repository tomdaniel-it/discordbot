module.exports = class CommandHandler{
    constructor(command){
        this.command = command;
    }

    run(){
        var command_dir = "../domain/commands/";
        switch(this.command.getCommand()){
            case "ping":
                require(command_dir + 'Ping.js').execute(this.command);
                break;
            case "help":
                require(command_dir + 'Help.js').execute(this.command);
                break;
            case "insult":
                require(command_dir + 'Insult.js').execute(this.command);
                break;
            case "meme":
                require(command_dir + 'Meme.js').execute(this.command);
                break;
            case "fancy":
                require(command_dir + 'Fancy.js').execute(this.command);
                break;
            case "purge":
                require(command_dir + 'Purge.js').execute(this.command);
                break;
            case "say":
                require(command_dir + 'Say.js').execute(this.command);
                break;
            case "coinflip":
                require(command_dir + 'Coinflip.js').execute(this.command);
                break;
            case "music_play":
                require(command_dir + 'Music_Play.js').execute(this.command);
                break;
            case "music_stop":
                require(command_dir + 'Music_Stop.js').execute(this.command);
                break;
            case "music_add":
                require(command_dir + 'Music_Add.js').execute(this.command);
                break;
            case "music_pick":
                require(command_dir + 'Music_Pick.js').execute(this.command);
                break;
            case "music_skip":
                require(command_dir + 'Music_Skip.js').execute(this.command);
                break;
            case "music_purge":
                require(command_dir + 'Music_Purge.js').execute(this.command);
                break;
            case "music_list":
                require(command_dir + 'Music_List.js').execute(this.command);
                break;
            default:
                return;
        }
    }
};